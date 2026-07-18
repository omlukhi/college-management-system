const { Gallery } = require('../models/mongodbModels');

// Get all gallery photos
exports.getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadDate: -1 });
    res.json({ success: true, gallery: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload photo to gallery album
exports.uploadToGallery = async (req, res) => {
  const { albumName, description } = req.body;
  if (!req.file || !albumName) {
    return res.status(400).json({ success: false, message: 'Image file and Album Name are required.' });
  }

  try {
    const imgPath = `/uploads/gallery/${req.file.filename}`;
    const newImage = await Gallery.create({
      albumName,
      imageUrl: imgPath,
      description
    });

    res.status(201).json({ success: true, message: 'Image uploaded to gallery.', image: newImage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
