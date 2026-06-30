const pool = require("../config/db")

async function findUserByNameOrEmail(name, email) {
    const result = await pool.query(
        `SELECT name, email FROM users WHERE name = $1 OR email = $2`,
        [name, email]
    );
    return result.rows;
}

async function findUserByName(name) {
    const result = await pool.query(
        `SELECT * FROM users WHERE name = $1`,
        [name]
    );
    return result.rows[0]; // Return single user or undefined
}

async function findUserById(id) {
    const result = await pool.query(
        `SELECT id, name, email, image_url, role FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

async function createUser(name, email, passwordHash, avatarPath) {
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, image_url)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, passwordHash, avatarPath]
    );
    return result.rows[0];
}

async function createUserCart(userId) {
    await pool.query(
        `INSERT INTO carts (user_id) VALUES ($1)`,
        [userId]
    );
}

async function saveRefreshToken(userId, token, expiresAt) {
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
        [userId, token, expiresAt]
    );
}

async function findRefreshToken(token) {
    const result = await pool.query(
        `SELECT * FROM refresh_tokens WHERE token = $1`,
        [token]
    );
    return result.rows[0];
}

async function deleteRefreshToken(id) {
    await pool.query(
        `DELETE FROM refresh_tokens WHERE id = $1`,
        [id]
    );
}

module.exports = {
    findUserByNameOrEmail,
    findUserByName,
    findUserById,
    createUser,
    createUserCart,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken
};
