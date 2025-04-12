const storecontroller = require("../controllers/store.controllers");
const express = require("express");
const router = express.Router();

router.get('/getAll',storecontroller.getAllstores);
router.post('/create',storecontroller.createStore);
router.get('/:id',storecontroller.getStoreById);
router.put('/store',storecontroller.updateStore);
router.delete("/:id",storecontroller.deleteStore);

module.exports = router; 