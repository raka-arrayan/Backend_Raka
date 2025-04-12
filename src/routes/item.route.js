const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { createItem, getItems, getItemById, getItemsByStoreId,deleteItemById,updateItemById } = require("../controllers/item.controller");


router.post("/create", upload.single("image"), createItem);
router.get("/", getItems);
router.get("/byId/:id", getItemById);
router.get("/byStoreId/:storeId", getItemsByStoreId);
router.delete("/:id", deleteItemById);
router.put("/", upload.single("image"), updateItemById);







module.exports = router;
