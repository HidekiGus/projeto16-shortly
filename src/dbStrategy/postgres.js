import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const user = 'postgres';
const password = '123456';
const host = 'localhost';
const port = 5432;
const database = 'shortly';

const connection = new Pool({
    user,
    password,
    host,
    port,
    database
});

// connection.query(`INSERT INTO users (name, email, password) VALUES ('Gus', 'gus@gmail.com', '123abc');`).then((response) => console.log(response.rows)).catch(e => console.log(e.code));

export default connection;