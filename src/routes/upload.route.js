const express = require("express");
const upload = require("../utils/multerConfig"); // Import multer storage config
const { uploadImage } = require("../controllers/upload.controller"); // Import controller

const router = express.Router();

// Route upload gambar
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
