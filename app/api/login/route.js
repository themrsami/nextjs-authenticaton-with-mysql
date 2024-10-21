'use server';
import DBConnection from '@/dbconnection/db'; // Import your DB connection
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library

export async function POST(request) {
    try {
        const body = await request.json(); // Parse the incoming JSON request body
        const { email, password } = body;

        // Extract the user's IP address from the request headers
        const ip = request.headers.get('x-forwarded-for') || request.connection.remoteAddress;

        // Connect to the database
        const db = await DBConnection();

        // Check if the user exists
        const [userRows] = await db.query('SELECT id, email, fullname, password FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return new Response(JSON.stringify({ message: 'Invalid credentials.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = userRows[0];

        // Verify password (use your password hashing method here)
        if (user.password !== password) {
            return new Response(JSON.stringify({ message: 'Invalid credentials.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Check the number of active sessions
        const [sessionRows] = await db.query('SELECT * FROM sessions WHERE user_id = ?', [user.id]);
        const sessionCount = sessionRows.length;

        if (sessionCount >= 3) {
            // Return the active sessions to the client
            return new Response(JSON.stringify({
                message: 'Device limit exceeded. Please log out from a previous device.',
                activeSessions: sessionRows, // Include active sessions in the response
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const generateSessionId = () => {
            return 'session_' + uuidv4(); // Generates a UUID prefixed with 'session_'
        };

        // Create a new session with IP address
        const sessionId = generateSessionId(); // Generate session ID

        await db.query('INSERT INTO sessions (user_id, session_number, session_id, ip_address) VALUES (?, ?, ?, ?)', [
            user.id,
            sessionCount + 1, // Increment session count for new session
            sessionId,
            ip, // Store the IP address in the session
        ]);

        // Respond with success message, session details, and user info
        return new Response(JSON.stringify({
            message: 'Login successful!',
            session_id: sessionId,
            user_id: user.id,
            email: user.email,      // Include email in the response
            fullname: user.fullname, // Include fullname in the response
            ip_address: ip,          // Include IP address in the response
        }), {
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
