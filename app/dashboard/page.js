"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useAppContext } from "../context/appcontext";

const Dashboard = () => {
    const router = useRouter();
    const { fullname, setFullname, email, setEmail } = useAppContext();

    useEffect(() => {
        // Read cookies only on the client side
        const fullnameCookie = document.cookie.split('; ').find(row => row.startsWith('fullname='));
        const emailCookie = document.cookie.split('; ').find(row => row.startsWith('email='));
        const userIdCookie = document.cookie.split('; ').find(row => row.startsWith('user_id='));
        const sessionIdCookie = document.cookie.split('; ').find(row => row.startsWith('session_id='));

        if (!fullnameCookie || !emailCookie || !userIdCookie || !sessionIdCookie) {
            clearSession();
            router.push('/');
            return;
        }

        if (fullnameCookie) {
            setFullname(fullnameCookie.split('=')[1]);
        }
        if (emailCookie) {
            setEmail(emailCookie.split('=')[1]);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('session_id='));

            if (!sessionCookie) {
                clearSession();
                router.push('/');
                return;
            }

            const sessionId = sessionCookie.split('=')[1];
            const userId = document.cookie.split('; ').find(row => row.startsWith('user_id=')).split('=')[1];

            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, user_id: userId }),
            });

            if (response.ok) {
                clearSession();
                router.push('/');
            } else {
                const result = await response.json();
                console.error(result.message);
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const clearSession = () => {
        document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'fullname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('session_id');
    };

    return (
        <>
            <nav className="max-w-[100%] px-4 mx-auto my-8 flex justify-between">
                <Link href="/dashboard">
                    <h1 className="text-2xl text-center font-semibold border border-black px-4 py-1">Dashboard</h1>
                </Link>
                <div className="flex gap-2 justify-center items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="ring-1 px-4 py-1.5 ring-slate-950">Profile</div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                <span className="text-lg ring-1 ring-slate-950 px-2"> {fullname} </span>
                                    <span>{email}</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </>
    );
};

export default Dashboard;
