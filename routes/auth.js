const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Rota de registro com upload de foto de perfil
router.post('/register', upload.single('profilePicture'), authController.register);

// Rota de login
router.post('/login', authController.login);

// Rota para obter dados do usuário logado
router.get('/me', auth, authController.getMe);

// Rota para atualizar foto de perfil
router.put('/profile-picture', auth, upload.single('profilePicture'), authController.updateProfilePicture);

module.exports = router;
