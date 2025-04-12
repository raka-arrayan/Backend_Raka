const pool = require("../database/pg.database");
const { v4: uuidv4 } = require('uuid');

exports.createTransaction = async (user_id, item_id, quantity, total) => {
    try {
        const query = `
            INSERT INTO transactions (id, user_id, item_id, quantity, total, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;

        const values = [uuidv4(), user_id, item_id, quantity, total, 'pending'];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error executing transaction query:", error);
        throw error;
    }
};



exports.payTransaction = async (transactionId) => {
    try {
        // Ambil transaksi berdasarkan transactionId
        const transactionQuery = `SELECT * FROM transactions WHERE id = $1`;
        const transactionResult = await pool.query(transactionQuery, [transactionId]);

        if (transactionResult.rows.length === 0) {
            return null;
        }

        const transaction = transactionResult.rows[0];

        if (transaction.status === "paid") {
            return { success: false, message: "Transaction already paid" };
        }

        // Ambil informasi user
        const userQuery = `SELECT balance FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [transaction.user_id]);

        if (userResult.rows.length === 0) {
            return { success: false, message: "User not found" };
        }

        const user = userResult.rows[0];

        // Periksa apakah saldo cukup
        if (user.balance < transaction.total) {
            return { success: false, message: "Insufficient balance" };
        }

        // Ambil informasi item
        const itemQuery = `SELECT stock FROM items WHERE id = $1`;
        const itemResult = await pool.query(itemQuery, [transaction.item_id]);

        if (itemResult.rows.length === 0) {
            return { success: false, message: "Item not found" };
        }

        const item = itemResult.rows[0];

        // Periksa apakah stok cukup
        if (item.stock < transaction.quantity) {
            return { success: false, message: "Insufficient stock" };
        }

        // Mulai transaksi database
        await pool.query("BEGIN");

        // Kurangi saldo user
        const updateBalanceQuery = `UPDATE users SET balance = balance - $1 WHERE id = $2`;
        await pool.query(updateBalanceQuery, [transaction.total, transaction.user_id]);

        // Kurangi stok item
        const updateStockQuery = `UPDATE items SET stock = stock - $1 WHERE id = $2`;
        await pool.query(updateStockQuery, [transaction.quantity, transaction.item_id]);

        // Ubah status transaksi menjadi "paid"
        const updateTransactionQuery = `UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *`;
        const updatedTransactionResult = await pool.query(updateTransactionQuery, [transactionId]);

        // Commit transaksi database
        await pool.query("COMMIT");

        return { success: true, data: updatedTransactionResult.rows[0] };
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error processing payment:", error);
        throw error;
    }
};


exports.deleteTransaction = async (transactionId) => {
    try {
        // Ambil transaksi berdasarkan ID
        const querySelect = `SELECT * FROM transactions WHERE id = $1`;
        const resultSelect = await pool.query(querySelect, [transactionId]);

        if (resultSelect.rows.length === 0) {
            return null; // Transaksi tidak ditemukan
        }

        const queryDelete = `DELETE FROM transactions WHERE id = $1 RETURNING *`;
        const resultDelete = await pool.query(queryDelete, [transactionId]);

        return resultDelete.rows[0];
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
};


exports.getTransactions = async () => {
    try {
        const query = `
            SELECT 
                t.*,
                json_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email,
                    'password', u.password, 
                    'balance', u.balance,
                    'created_at', u.created_at
                ) AS user,
                json_build_object(
                    'id', i.id,
                    'name', i.name,
                    'price', i.price,
                    'store_id', i.store_id,
                    'image_url', i.image_url,
                    'stock', i.stock,
                    'created_at', i.created_at
                ) AS item
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN items i ON t.item_id = i.id
            ORDER BY t.created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};

