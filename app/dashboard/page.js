// app/dashboard/page.js (or wherever your Dashboard component is located)

'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    const handleLogout = async () => {
        // Implement logout API call
        try {
            const sessionId = document.cookie.split('; ').find(row => row.startsWith('session_id=')).split('=')[1]; // Get session_id from cookies
            const userId = document.cookie.split('; ').find(row => row.startsWith('user_id=')).split('=')[1];
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, user_id: userId }),
            });

            if (response.ok) {
                // Clear the session from localStorage
                localStorage.removeItem('session_id');
                // Redirect to the login page or home
                router.push('/');
            } else {
                // Handle error response
                const result = await response.json();
                console.error(result.message);
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <header className="p-4 bg-slate-800">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button className="mt-2 bg-red-500 p-2 rounded" onClick={handleLogout}>Logout</button>
            </header>
            <main className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Card 1</h2>
                        <p className="mt-2">This is a description for card 1.</p>
                    </div>
                    <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Card 2</h2>
                        <p className="mt-2">This is a description for card 2.</p>
                    </div>
                    <div className="bg-slate-700 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Card 3</h2>
                        <p className="mt-2">This is a description for card 3.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
