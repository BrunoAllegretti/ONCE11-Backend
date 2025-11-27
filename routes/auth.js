const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');

// Config do multer para salvar a foto no disco
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // pasta onde salva
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nome único
  }
});

const upload = multer({ storage });

// ROTAS
router.post('/register', upload.single('profilePicture'), authController.register);
router.post('/login', authController.login);

// Rota para obter dados do usuário logado
const auth = require('../middleware/auth');
router.get('/me', auth, authController.getMe);

module.exports = router;
