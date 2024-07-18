// routes/imageRoutes.js
const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');

const router = express.Router();

// Configuración de multer para mantener el nombre original del archivo
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); // Mantener el nombre original del archivo
  }
});
const upload = multer({ storage: storage });

// Rutas de la API para manejar imágenes
router.post('/', upload.single('image'), imageController.createImage);
router.get('/:id', imageController.getImageById);
router.get('/', imageController.getAllImages);
router.put('/:id', upload.single('image'), imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router;
