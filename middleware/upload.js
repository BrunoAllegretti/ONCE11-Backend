const multer = require('multer');

// Armazena arquivo em memória (buffer) em vez de disco
// Perfeito para ambientes como Render que não persistem arquivos
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Aceita apenas imagens
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

module.exports = upload;
