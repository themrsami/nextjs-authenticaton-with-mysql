import DBConnection from '@/dbconnection/db'; // Import your DB connection

export async function POST(request) {
    try {
        const body = await request.json();
        const { session_id, user_id, session_number } = body; // Get the session ID to delete

        // Connect to the database
        const db = await DBConnection();

        // Delete the session from the database
        const result = await db.query('DELETE FROM sessions WHERE session_id = ? AND user_id = ? AND session_number = ?', [session_id, user_id, session_number]);

        // Check if the session was deleted
        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: 'Session not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Re-sequence the remaining sessions for the user
        await db.query('UPDATE sessions SET session_number = session_number - 1 WHERE user_id = ? AND session_number > ?', [user_id, session_number]);

        // Optionally, you may want to reset the session numbers starting from 1
        const sessions = await db.query('SELECT session_id FROM sessions WHERE user_id = ? ORDER BY session_number', [user_id]);
        for (let i = 0; i < sessions.length; i++) {
            await db.query('UPDATE sessions SET session_number = ? WHERE session_id = ?', [i + 1, sessions[i].session_id]);
        }

        // Respond with a success message
        return new Response(JSON.stringify({ message: 'Session deleted and numbers updated successfully.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error processing the request:', error);
        return new Response(JSON.stringify({ error: 'Failed to process the request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
