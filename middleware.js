// middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
    const sessionId = req.cookies.get('session_id'); // Get session ID from cookies

    console.log('Session ID:', sessionId); // Log for debugging

    // If no session ID found, redirect to login
    if (!sessionId) {
        console.log('No session ID found, redirecting to login...');
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Ensure the sessionId is a string
    const sessionIdValue = typeof sessionId === 'string' ? sessionId : sessionId.value;

    // Validate session via API call
    const sessionCheckResponse = await fetch(`${req.nextUrl.origin}/api/validate-session?session_id=${sessionIdValue}`);

    // Check if the response indicates a valid session
    if (!sessionCheckResponse.ok) {
        console.log('Invalid session ID, redirecting to login...');
        return NextResponse.redirect(new URL('/', req.url));
    }

    console.log('Valid session found, proceeding to the dashboard...');

    // If session is valid, allow the request to proceed
    return NextResponse.next();
}

// Specify paths where middleware should apply
export const config = {
    matcher: ['/dashboard/:path*', '/otherProtectedRoute/:path*'], // Add paths that need protection
};
