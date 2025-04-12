const db= require("../database/pg.database");

exports.getAllstores = async () => {
    try {
        const res = await db.query("SELECT * FROM stores");
        return res.rows;
    } catch (error) {
        console.error("error executing query", error);
    }
};

exports.createStore = async (store) => {
    try {
        const res = await db.query(
            "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
            [store.name, store.address]
        );
        return res.rows[0];
    } catch (error) {
        console.error("error executing query", error);
    }
};


exports.getStoreById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
        return res.rows[0]; 
    } catch (error) {
        console.error("Error executing query", error);
        
    }
};


exports.updateStore = async (id, name, address) => {
    try {
        const res = await db.query(
            "UPDATE stores SET name = $2, address = $3 WHERE id = $1 RETURNING *",
            [id, name, address]
        );

        return res.rows[0] || null;
    } catch (error) {
        console.error("Error executing update query", error);
        throw error;
    }
};


exports.deleteStore = async (id) => {
    try {
        await db.query("DELETE FROM stores WHERE id = $1", [id]);
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

