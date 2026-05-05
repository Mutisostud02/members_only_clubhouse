const pool = require('./pool.js')

async function getUsers() {
    try{
    const { rows } = await pool.query(`SELECT * FROM users`)
    return rows;
    } catch (err) {
        throw err;        
    }
}

async function addUser(firstname, lastname, email, password ) {
    try {
        await pool.query('INSERT INTO users (firstname, lastname, email, password) values($1, $2, $3, $4)', [firstname, lastname, email, password])
    } catch (err) {
        throw err;
    }
}

async function getUserByEmail(email) {
try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1' , [email])
    return rows[0];
} catch(err) {
    throw err;
}
}

async function getAllPosts() {
    try {
        const { rows } = await pool.query('SELECT * FROM posts INNER JOIN users ON posts.user_id = users.id ')
        return rows;
    } catch(err) {
        throw err;
    }
}

async function getPostById(id) {
    try {
        const { rows } = await pool.query(`
            SELECT * FROM posts
            INNER JOIN users ON posts.user_id = users.id WHERE posts.id = $1`, [id]);
            console.log(rows)
        return rows[0]

    } catch (err) {
        throw err;
    }
}

async function addNewPost(user_id, title, content) {
    try {
        const rows = await pool.query(`INSERT INTO posts(user_id, title, content) VALUES($1, $2, $3)`, [user_id, title, content])
    } catch (error) {
        throw error;
    }
}


async function confirmPasscode(passcode, used_by_id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await client.query(
            `UPDATE passcodes 
             SET is_used = true, 
                 used_by = $1, 
                 used_at = now() 
             WHERE code = $2 AND is_used = false
             RETURNING *`,
            [used_by_id, passcode]
        );

        if(result.rowCount === 0) {
            await client.query("ROLLBACK");
            return false;
        }

        await client.query(
            'UPDATE users SET membership_status=true WHERE id=$1', [used_by_id]
        );

        await client.query("COMMIT");

        return true;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function adminAvailabledPasscodes() {
    try {
    const { rows } = await pool.query(`SELECT * FROM passcodes WHERE is_used = FALSE`);
    return rows;
    
    } catch (error) {
        throw error;
    }
}

async function adminAddPasscode(passcode) {
    try {
        await pool.query(`INSERT INTO passcodes(code) VALUES($1)`, [passcode]);
    } catch(error) {
        throw error;
    }
}

module.exports = { getUsers, addUser, getUserByEmail, getAllPosts, getPostById, addNewPost, confirmPasscode, adminAddPasscode, adminAvailabledPasscodes }