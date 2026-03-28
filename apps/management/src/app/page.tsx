import { redirect } from 'next/navigation';

export default function Home() {
  // Middleware handles auth — if we reach here the user is authenticated.
  // Redirect root to the hotels list.
  redirect('/hotels');
}
