const multer = require('multer');

// Usamos memoria para evitar guardar archivos no válidos en disco
const storage = multer.memoryStorage();

// Filtro de tipos permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPG, PNG, WEBP).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máx
  },
});

module.exports = upload;
