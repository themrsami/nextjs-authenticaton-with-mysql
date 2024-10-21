'use client';
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';

const Login = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state
    const [activeSessions, setActiveSessions] = useState([]); // To store active sessions
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when form is submitted
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Set the session ID in cookies
                document.cookie = `session_id=${result.session_id}; path=/; secure; samesite=strict`;
                document.cookie = `user_id=${result.user_id}; path=/; secure; samesite=strict`;
                document.cookie = `fullname=${result.fullname}; path=/; secure; samesite=strict`;
                document.cookie = `email=${result.email}; path=/; secure; samesite=strict`;

                // If login is successful, redirect to dashboard
                router.push('/dashboard');
            } else {
                setError(result.message || 'Login failed');
                if (result.activeSessions) {
                    setActiveSessions(result.activeSessions); // Set active sessions
                }
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false); // End loading after API response
        }
    };

    // Function to delete a session
    const handleDeleteSession = async (sessionId, sessionNumber, userId) => {
        try {
            const response = await fetch('/api/deletesession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, session_number: sessionNumber, user_id: userId }), // Send session ID to delete
            });

            const result = await response.json();

            if (response.ok) {
                // Remove the deleted session from the active sessions list
                setActiveSessions((sessions) => sessions.filter(session => session.session_id !== sessionId));
            } else {
                setError(result.message || 'Failed to delete session');
            }
        } catch (err) {
            setError('Something went wrong while deleting the session. Please try again.');
        }
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Login to your account to access your dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" id="email" type="email" required />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" id="password" type="password" required />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="rememberme" name="rememberme" />
                            <Label htmlFor="rememberme">Remember me</Label>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>

                    {/* Display active sessions if any */}
                    {activeSessions.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Active Sessions:</h3>
                            <ul className="list-disc list-inside">
                                {activeSessions.map((session) => (
                                    <li key={session.session_number} className="flex justify-between items-center">
                                        <span>{session.session_number} Created at : {session.created_at}</span>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleDeleteSession(session.session_id, session.session_number, session.user_id)}
                                        >
                                            Delete
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
