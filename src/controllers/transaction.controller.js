const transactionRepository = require("../repositories/transaction.repository");
const itemRepository = require("../repositories/item.repository");
const pool = require("../database/pg.database");
const { v4: uuidv4 } = require('uuid');

exports.createTransaction = async (req, res) => {
    try {
        const { user_id, item_id, quantity } = req.body;

        if (user_id === undefined || item_id === undefined || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }
        

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be larger than 0",
                payload: null
            });
        }
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const userIdString = String(user_id).trim();
        const itemIdString = String(item_id).trim();

        console.log("Received user_id:", `"${userIdString}"`);
        console.log("Received item_id:", `"${itemIdString}"`);

        if (!uuidRegex.test(userIdString) || !uuidRegex.test(itemIdString)) {
            return res.status(400).json({
                success: false,
                message: "Invalid UUID format",
            });
        }

        const userExists = await pool.query("SELECT id FROM users WHERE id = $1::uuid", [user_id]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
                payload: null
            });
        }

        const total = item.price * quantity;

        const transaction = await transactionRepository.createTransaction(user_id, item_id, quantity, total);

        res.status(201).json({
            success: true,
            message: "Transaction created",
            payload: transaction
        });
    } catch (error) {
        console.error("Transaction creation failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create transaction",
            payload: null
        });
    }
};



exports.payTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;

        if (!transactionId) {
            return res.status(400).json({
                success: false,
                message: "Transaction ID is required",
            });
        }

        const result = await transactionRepository.payTransaction(transactionId);

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
                payload: null,
            });
        }

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                payload: null,
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment successful",
            payload: result.data,
        });
    } catch (error) {
        console.error("Payment processing failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to pay",
            payload: null,
        });
    }
};


exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Pastikan UUID valid
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID format",
                payload: null
            });
        }

        const deletedTransaction = await transactionRepository.deleteTransaction(id);

        if (!deletedTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
                payload: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction deleted",
            payload: deletedTransaction
        });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete transaction",
            payload: null
        });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getTransactions();
        return res.status(200).json({
            success: true,
            message: "Transactions found",
            payload: transactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get transactions",
            payload: null
        });
    }
};



