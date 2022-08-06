import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

console.log(password);

const connection = new Pool({
    user,
    password,
    host,
    port,
    database
});

connection.query('SELECT * FROM users;').then((response) => console.log(response));

export default connection;