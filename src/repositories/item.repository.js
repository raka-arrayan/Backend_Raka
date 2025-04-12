const { v4: uuidv4 } = require("uuid");
const pool = require("../database/pg.database");

const checkStoreExists = async (store_id) => {
  try {
    console.log("Checking store_id:", store_id);
    const result = await pool.query("SELECT id FROM stores WHERE id = $1", [store_id]);
    console.log("Query result:", result.rows);

    return result.rows.length > 0;
  } catch (error) {
    console.error("Database Error in checkStoreExists:", error);
    return false;
  }
};

const createItemInDB = async (name, price, store_id, image_url, stock) => {
  try {
    const id = uuidv4();
    const created_at = new Date().toISOString();

    const query = `
      INSERT INTO items (id, name, price, store_id, image_url, stock, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [id, name, price, store_id, image_url, stock, created_at];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Database Error in createItemInDB:", error);
    throw error;
  }
};

const getAllItems = async () => {
  try {
    console.log("Executing SQL query to get all items...");
    const result = await pool.query("SELECT * FROM items");
    console.log("Query result:", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllItems:", error);
    throw error;
  }
};


const updateItemInDB = async (id, name, price, store_id, stock, image) => {
  return await query("UPDATE items SET name=$1, price=$2, store_id=$3, stock=$4, image=$5 WHERE id=$6 RETURNING *", 
                     [name, price, store_id, stock, image, id]);
};



const getItemById = async (item_id) => {
  try {
    const query = "SELECT id, name, price FROM items WHERE id = $1::uuid";
    const result = await pool.query(query, [item_id]);

    if (result.rows.length === 0) {
      return null; // Item tidak ditemukan
    }

    return result.rows[0];
  } catch (error) {
    console.error("Database Error in getItemById:", error);
    throw error;
  }
};

module.exports = { createItemInDB, checkStoreExists, getAllItems,updateItemInDB,getItemById};