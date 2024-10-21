'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Adjusted import for Next.js Router
import Form from "./components/form";

export default function Home() {
  const router = useRouter(); // Initialize the router
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const checkSession = async () => {
      // Get session_id from cookies
      const sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('session_id='))
        ?.split('=')[1];

      if (sessionId) {
        // Call the validate session API
        const response = await fetch(`/api/validate-session?session_id=${sessionId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            // Update cookies with user_id, fullname, and email
            document.cookie = `user_id=${data.user_id}; path=/;`;
            document.cookie = `email=${data.email}; path=/;`;
            document.cookie = `fullname=${data.fullname}; path=/;`;

            // Redirect to dashboard
            router.push('/dashboard');
            return; // Exit early
          }
        }
      }
      // Stop loading if session is invalid or no session found
      setLoading(false);
    };

    checkSession(); // Run the session check
  }, [router]); // Run effect on mount

  // Show loading spinner while checking session
  if (loading) {
    return (
      <div className="flex mx-auto justify-center items-center h-screen">
        <div className="spinner">Loading...</div> {/* Replace with a spinner component if you have one */}
      </div>
    );
  }

  return (
    <div className="flex mx-auto justify-center items-center h-screen">
      <Form />
    </div>
  );
}
