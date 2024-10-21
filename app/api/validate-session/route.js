'use server';
// app/api/validate-session/route.js

import DBConnection from '@/dbconnection/db'; // Import your DB connection

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id'); // Get session_id from query parameters

    if (!sessionId) {
        return new Response(JSON.stringify({ valid: false }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const db = await DBConnection();

        // Query to check session
        const [sessionRows] = await db.query('SELECT user_id FROM sessions WHERE session_id = ?', [sessionId]);

        // If session is found
        if (sessionRows.length > 0) {
            const userId = sessionRows[0].user_id; // Get user_id from session row

            // Now fetch the user information using user_id
            const [userRows] = await db.query('SELECT email, fullname FROM users WHERE id = ?', [userId]);

            // If user is found
            if (userRows.length > 0) {
                const { email, fullname } = userRows[0]; // Destructure user info
                return new Response(JSON.stringify({
                    valid: true,
                    user_id: userId,
                    email,
                    fullname
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                return new Response(JSON.stringify({ valid: false }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } else {
            return new Response(JSON.stringify({ valid: false }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error checking session:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
