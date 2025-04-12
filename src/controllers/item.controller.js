const { createItemInDB, checkStoreExists } = require("../repositories/item.repository");
const { query } = require("../database/pg.database");

const createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({ success: false, message: "Image is required", payload: null });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(store_id)) {
      return res.status(400).json({ success: false, message: "Invalid store_id format", payload: null });
    }

    const storeExists = await checkStoreExists(store_id);
    console.log("Store Exists:", storeExists);

    if (!storeExists) {
      return res.status(404).json({ success: false, message: "Store not found", payload: null });
    }

    const newItem = await createItemInDB(name, price, store_id, image, stock);

    return res.status(201).json({ success: true, message: "Item created", payload: newItem });
  } catch (error) {
    console.error("Error in createItem:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
  }
};

const getItems = async (req, res) => {
  try {
    console.log("Fetching all items...");
    const items = await query("SELECT * FROM items"); 
    console.log("Items retrieved:", items.rows);

    if (!items.rows || items.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No items found", payload: [] });
    }

    return res.status(200).json({ success: true, message: "Items found", payload: items.rows });
  } catch (error) {
    console.error("Error in getAllItems:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
        payload: null,
      });
    }

    const result = await query("SELECT * FROM items WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
        payload: null,
      });
    }

    // Jika item ditemukan
    return res.status(200).json({
      success: true,
      message: "Item found",
      payload: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching item by ID:", error);

    if (error.code === "ECONNREFUSED") { 
      return res.status(503).json({
        success: false,
        message: "Database unavailable",
        payload: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      payload: null,
    });
  }
};



const getItemsByStoreId = async (req, res) => {
    try {
        const { storeId } = req.params;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(storeId)) {
            return res.status(400).json({ success: false, message: "Invalid store ID format", payload: null });
        }

        const storeExists = await checkStoreExists(storeId);
        if (!storeExists) {
            return res.status(404).json({ success: false, message: "Store doesn't exist", payload: null });
        }

        const result = await query("SELECT * FROM items WHERE store_id = $1", [storeId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No items found for this store", payload: [] });
        }

        return res.status(200).json({ success: true, message: "Items found", payload: result.rows });
    } catch (error) {
        console.error("Error fetching items by store ID:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
    }
};

const deleteItemById = async (req, res) => {
    try {
        const { id } = req.params;

        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ success: false, message: "Invalid item ID format", payload: null });
        }

        
        const itemResult = await query("SELECT * FROM items WHERE id = $1", [id]);
        if (itemResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Item not found", payload: null });
        }

        const deletedItem = itemResult.rows[0];

        // Hapus item dari database
        await query("DELETE FROM items WHERE id = $1", [id]);

        return res.status(200).json({ 
            success: true, 
            message: "Item deleted", 
            payload: deletedItem 
        });

    } catch (error) {
        console.error("Error deleting item:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
    }
};



const updateItemById = async (req, res) => {
  try {
      const { id, name, price, store_id, stock } = req.body;
      const image = req.file ? req.file.path : null;

      // Validasi UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
          return res.status(400).json({ success: false, message: "Invalid item ID format", payload: null });
      }

      const updatedItem = await query(
          "UPDATE items SET name=$1, price=$2, store_id=$3, stock=$4, image=$5 WHERE id=$6 RETURNING *",
          [name, price, store_id, stock, image, id]
      );

      if (updatedItem.rowCount === 0) {
          return res.status(404).json({ success: false, message: "Item not found", payload: null });
      }

      return res.status(200).json({ success: true, message: "Item updated successfully", payload: updatedItem.rows[0] });
  } catch (error) {
      console.error("Database update error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error", payload: null });
  }
};


module.exports = { createItem, getItems, getItemById, getItemsByStoreId,deleteItemById,updateItemById};
