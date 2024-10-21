'use server';
import DBConnection from '@/dbconnection/db'; // Import your DB connection

export async function POST(request) {
    try {
        const body = await request.json(); // Parse the incoming JSON request body

        console.log('Received data:', body); // Log the data to the server console

        const { fullname, email, confirmemail, password, confirmpassword } = body;

        // Custom validation logic
        const errors = [];

        // Validate full name
        if (!fullname || typeof fullname !== 'string' || fullname.trim() === '') {
            errors.push({ field: 'fullname', message: 'Full name is required and must be a string.' });
        }

        // Validate email
        if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            errors.push({ field: 'email', message: 'A valid email address is required.' });
        }

        // Validate confirm email
        if (!confirmemail || confirmemail !== email) {
            errors.push({ field: 'confirmemail', message: 'Confirm email must match the email.' });
        }

        // Validate password
        if (!password || password.length < 6) {
            errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
        }

        // Validate confirm password
        if (!confirmpassword || confirmpassword !== password) {
            errors.push({ field: 'confirmpassword', message: 'Confirm password must match the password.' });
        }

        // Check if there are validation errors
        if (errors.length > 0) {
            return new Response(JSON.stringify({ errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Connect to the database
        const db = await DBConnection(); // Make sure this is awaited as it's asynchronous

        // Check if the user already exists in the database
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            // User already exists
            return new Response(JSON.stringify({ error: 'Email already exists.' }), {
                status: 409, // 409 Conflict status
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // If the user does not exist, insert them into the database
        const createdAt = new Date(); // Capture the current date-time for created_at
        const insertUserQuery = `
            INSERT INTO users (fullname, email, password, created_at) 
            VALUES (?, ?, ?, ?)
        `;
        await db.query(insertUserQuery, [fullname, email, password, createdAt]);

        // Respond with success message after user is saved
        return new Response(JSON.stringify({ message: 'User registered successfully!' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing the request:', error);

        // Respond with an error message in case of failure
        return new Response(JSON.stringify({ error: 'Failed to process the request.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
