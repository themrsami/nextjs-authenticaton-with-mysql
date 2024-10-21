// db.js (MySQL example)
import mysql from 'mysql2/promise'; // or any appropriate MySQL library

let connection;

async function DBConnection() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'authentication'
        });
        console.log('DB connected');
    }
    return connection;
}

export default DBConnection;
