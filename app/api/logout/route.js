// app/api/logout/route.js

import DBConnection from '@/dbconnection/db'; // Import your DB connection

export async function POST(request) {
    try {
        // Get the session ID from cookies
        const cookies = request.headers.get('cookie');
        const sessionIdCookie = cookies.split('; ').find(row => row.startsWith('session_id='));
        const sessionId = sessionIdCookie ? sessionIdCookie.split('=')[1] : null;


        // If no session ID found, return an error
        if (!sessionId) {
            return new Response(JSON.stringify({ message: 'No active session found.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Connect to the database
        const db = await DBConnection();

        // Delete the session from the database
        await db.query('DELETE FROM sessions WHERE session_id = ?', [sessionId]);

        // Return a response indicating success
        return new Response(JSON.stringify({ message: 'Logout successful.' }), {
            status: 200,
            headers: {
                'Set-Cookie': 'session_id=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT;', // Clear the session cookie
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return new Response(JSON.stringify({ error: 'Failed to log out.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
