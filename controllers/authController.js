const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Função helper para converter imagem para Base64
const fileToBase64 = (buffer, contentType) => {
    if (!buffer) return null;
    return {
        data: buffer.toString('base64'),
        contentType: contentType
    };
};

// Função helper para retornar foto de perfil
const getProfilePictureUrl = (profilePicture, profilePictureContentType) => {
    const DEFAULT = 'https://i.imgur.com/4ZQZ4Zr.png';
    
    if (!profilePicture) return DEFAULT;
    
    // Se for URL externa, retorna como está
    if (typeof profilePicture === 'string' && (profilePicture.startsWith('http://') || profilePicture.startsWith('https://'))) {
        return profilePicture;
    }
    
    // Se for Base64, retorna como data URL
    if (typeof profilePicture === 'string' && profilePicture.length > 100) {
        return `data:${profilePictureContentType || 'image/jpeg'};base64,${profilePicture}`;
    }
    
    return DEFAULT;
};

// =========================
//  REGISTRO DO USUÁRIO
// =========================
exports.register = async (req, res) => {
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

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Usuário já existe' });
        }

        // Converte imagem para Base64 se enviada
        let profilePicture = null;
        let profilePictureContentType = null;
        
        if (req.file) {
            profilePicture = req.file.buffer.toString('base64');
            profilePictureContentType = req.file.mimetype;
        }

        user = new User({
            name,
            email,
            password,
            profilePicture,
            profilePictureContentType,
            address: {
                cep,
                street,
                number,
                neighborhood,
                city,
                state
            }
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        photo: getProfilePictureUrl(user.profilePicture, user.profilePictureContentType)
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Erro no servidor" });
    }
};

// =========================
//  PEGAR DADOS DO USUÁRIO
// =========================
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            photo: getProfilePictureUrl(user.profilePicture, user.profilePictureContentType)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};

// =========================
//  LOGIN DO USUÁRIO
// =========================
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;

                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        photo: getProfilePictureUrl(user.profilePicture, user.profilePictureContentType)
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};

// =========================
//  ATUALIZAR FOTO DE PERFIL
// =========================
exports.updateProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'Nenhuma imagem foi enviada' });
        }

        // Converte imagem para Base64
        user.profilePicture = req.file.buffer.toString('base64');
        user.profilePictureContentType = req.file.mimetype;
        await user.save();

        res.json({
            msg: 'Foto de perfil atualizada com sucesso',
            photo: getProfilePictureUrl(user.profilePicture, user.profilePictureContentType)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};
