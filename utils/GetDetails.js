// utils/GetDetails.js

export function generateSessionId() {
    return 'session-' + Math.random().toString(36).substr(2, 9); // Generate a random session ID
}

export function getDeviceInfo() {
    // This is a simplified way to get device info; you can enhance it as needed
    return navigator.userAgent; // In a browser environment, return the user agent
}
