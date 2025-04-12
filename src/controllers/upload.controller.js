const uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
  
      const imageUrl = req.file.path; // URL gambar yang diunggah ke Cloudinary
  
      res.json({
        success: true,
        message: "File uploaded successfully",
        imageUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  module.exports = { uploadImage };
  