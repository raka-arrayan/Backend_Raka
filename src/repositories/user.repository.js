const db = require("../database/pg.database");

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing query", error);
        return null;
    }
};

exports.createUser = async (user) => {
    try {
        const res = await db.query(
            `INSERT INTO users (name, email, password) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [user.name, user.email, user.password] 
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.loginUser = async (email, password) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2",
            [email, password]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing query", error);
        return null;
    }
};

exports.updateUser = async (user) => {
    try {
        const res = await db.query(
            `UPDATE users 
             SET name = $1, email = $2, password = $3
             WHERE id = $4
             RETURNING *`,
            [user.name, user.email, user.password, user.id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
};

exports.deleteUser = async (id) => {
    try {
        const res = await db.query(
            `DELETE FROM users WHERE id = $1::uuid RETURNING *`,
            [id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error deleting user:", error);
        return null;
    }
};

exports.topUpUserBalance = async (id, amount) => {
    try {
        const res = await db.query(
            `UPDATE users 
             SET balance = balance + $1 
             WHERE id = $2 
             RETURNING *`,
            [amount, id]
        );

        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing top-up query:", error);
        return null;
    }
};





