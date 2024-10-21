'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState('');
    const [fullname, setFullname] = useState('User'); // Default value for server-side rendering
    const [email, setEmail] = useState('No Email');   // Default value for server-side rendering
    // Load theme from local storage if available
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme to local storage whenever it changes
    useEffect(() => {
        if (theme) {
            localStorage.setItem('theme', theme);
        }
    }, [theme]);
    
    return (
        <AppContext.Provider value={{ theme, setTheme, fullname, setFullname, email, setEmail }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};