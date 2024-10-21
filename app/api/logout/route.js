'use server';
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

        // Retrieve the user_id of the session to be deleted
        const [sessionResult] = await db.query('SELECT user_id FROM sessions WHERE session_id = ?', [sessionId]);

        if (!sessionResult.length) {
            return new Response(JSON.stringify({ message: 'Session not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userId = sessionResult[0].user_id;

        // Delete the session from the database
        await db.query('DELETE FROM sessions WHERE session_id = ?', [sessionId]);

        // Retrieve all remaining sessions for this user, ordered by session_number
        const [remainingSessions] = await db.query(
            'SELECT id FROM sessions WHERE user_id = ? ORDER BY session_number ASC',
            [userId]
        );

        // Reorder the session numbers for the remaining sessions
        for (let i = 0; i < remainingSessions.length; i++) {
            const sessionIdToUpdate = remainingSessions[i].id;
            await db.query('UPDATE sessions SET session_number = ? WHERE id = ?', [i + 1, sessionIdToUpdate]);
        }

        // Return a success response with cookie cleared
        return new Response(JSON.stringify({ message: 'Logout successful and sessions reordered.' }), {
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
