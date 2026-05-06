require('dotenv').config()
const { Client } = require('pg')


SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    membership_status BOOLEAN DEFAULT FALSE,
    isAdmin BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS posts (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS passcodes  (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    used_by INT REFERENCES users(id),
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS replies (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,    
    content TEXT NOT NULL,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,    
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,    
    parent_reply_id INT REFERENCES replies(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_replies_post_id ON replies(post_id);
CREATE INDEX IF NOT EXISTS idx_replies_parent_id ON replies(parent_reply_id);

INSERT INTO users(firstname, lastname, email, password, membership_status, isadmin)
VALUES('Admin', 'User', 'adminVIPMembers026@gmail.com', '$2b$10$m6eB8XQytiPGHB2nUMjEA.EL7tP9Q3f4hmM5w7mCd0LoF9QdNjede', true, true)
ON CONFLICT (email) DO NOTHING;
`

async function main() {
    console.log("seeding...");
    const client = new Client( {
        connectionString: process.env.DATABASE_URL
    })
    try {
        await client.connect();

        await client.query(SQL);

        console.log("done");
    } catch(err) {
        console.error(err)
    } finally {
        await client.end();
    }
        
}
main();