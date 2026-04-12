/**
 * Excecutes an asynchronous function with automatic retries and exponential backoff delay.
 * Designed to stabilize flakiness in network operations like Firebase reads/writes
 * or Gemini AI API generation calls.
 *
 * @param fn The asynchronous function to execute (e.g., () => fetch(...))
 * @param retries Maximum number of times to retry before failing (default: 2)
 * @param delay The base delay in milliseconds before the first retry (default: 800)
 * @returns The resolved data from the asynchronous function
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  retries: number = 2,
  delay: number = 800
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      // Await inside the try-catch ensures any promise rejection is caught locally
      return await fn();
    } catch (error: any) {
      attempt++;

      // If we have exhausted our retries, throw the final error.
      // Throwing it directly preserves the original stack trace and error message
      // for up-stream ErrorBoundaries or crash reporting.
      if (attempt > retries) {
        throw error;
      }

      // Calculate exponential backoff delay: (delay * 2^(attempt-1))
      // attempt 1: delay * 1  (800ms)
      // attempt 2: delay * 2  (1600ms)
      // attempt 3: delay * 4  (3200ms)
      const exponentialDelay = delay * Math.pow(2, attempt - 1);
      
      // Jitter (0-20% randomization) to prevent thundering herd problems
      // if multiple simultaneous requests all retry at the exact same moment
      const jitter = exponentialDelay * 0.2 * Math.random();
      const waitTime = exponentialDelay + jitter;

      if (__DEV__) {
        console.warn(
          `[retryAsync] Async operation failed. Retrying... (Attempt ${attempt}/${retries} in ${Math.round(waitTime)}ms)`,
          error.message || error
        );
      }

      // Wait out the delay before allowing the while loop to re-execute
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}
