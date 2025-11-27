const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Caminho absoluto da pasta uploads
const uploadPath = path.join(__dirname, '../uploads');

// garante que a pasta existe
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Configuração do armazenamento no disco
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueName + ext);
    }
});

// Exportar o multer configurado
module.exports = multer({ storage });
