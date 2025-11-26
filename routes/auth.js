const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');

// Config do multer para foto de perfil
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      cep,
      street,
      number,
      neighborhood,
      city,
      state
    } = req.body;

    const profilePicture = req.file ? req.file.buffer : null;

    const newUser = new User({
      name,
      email,
      password,
      address: {
        cep,
        street,
        number,
        neighborhood,
        city,
        state
      },
      profilePicture
    });

    await newUser.save();

    res.json({ msg: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error("Erro no register:", error);
    res.status(500).json({ msg: 'Erro ao registrar.' });
  }
});

module.exports = router;
