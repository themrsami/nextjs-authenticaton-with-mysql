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
        const [sessionRows] = await db.query('SELECT * FROM sessions WHERE session_id = ?', [sessionId]);

        // If session found, return valid response
        if (sessionRows.length > 0) {
            return new Response(JSON.stringify({ valid: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
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
