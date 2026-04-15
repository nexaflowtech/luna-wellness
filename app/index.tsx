import { Redirect } from 'expo-router';

// Route all initial navigations through splash, which handles
// auth-aware routing after displaying the branded loading screen.
export default function Index() {
  return <Redirect href="/splash" />;
}
