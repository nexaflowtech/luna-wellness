/**
 * Custom Error strictly used to identify Timeout failures
 * up-stream for caching logic or retry wrappers.
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Wraps an asynchronous operation with a forceful duration timeout constraint.
 * Designed to prevent infinite hanging states from frozen cloud connections
 * (especially critical for Gemini AI requests and bad-signal Firebase events).
 *
 * @param promise The asynchronous operation (e.g., fetch(), getDoc())
 * @param timeoutMs The maximum allowed execution time in milliseconds (default: 12000)
 * @returns The generic type <T> evaluated accurately from the provided promise
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 12000
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout>;

  // A promise that forcefully rejects if it resolves out its timer
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new TimeoutError(`Async operation exceeded the ${timeoutMs}ms limit.`));
    }, timeoutMs);
  });

  try {
    // Race the original execution promise against the ticking timer.
    // Whichever completes (or rejects) first dictates the final evaluation.
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    // If the primary promise resolves or fails first, always clear the timer interval
    // to prevent memory leaks and unhandled background state hooks.
    clearTimeout(timeoutHandle!);
  }
}
