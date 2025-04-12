const multer = require("multer");
const { cloudinary } = require("../cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "items",
    format: async () => "png",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

module.exports = upload;