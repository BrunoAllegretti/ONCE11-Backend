const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');

// Config do multer para foto de perfil
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.single('profilePicture'), authController.register);

router.post('/login', authController.login);

module.exports = router;
