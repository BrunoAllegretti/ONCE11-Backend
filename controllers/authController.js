const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Função helper para construir URL absoluta da foto de perfil
// Aceita: nome do arquivo, caminho relativo ('uploads/..' ou '/uploads/...') ou URL absoluta
const getProfilePictureUrl = (req, value) => {
    const DEFAULT = 'https://i.imgur.com/4ZQZ4Zr.png';
    if (!value) return DEFAULT;
    if (typeof value !== 'string') return DEFAULT;
    // Se já for uma URL absoluta, retorna como está
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    // Normaliza extraindo apenas o nome do arquivo caso venha com caminhos
    const filename = path.basename(value);
    const protocol = req.protocol;
    const host = req.get('host');

    return `${protocol}://${host}/uploads/${filename}`;
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

        // Foto do upload ou padrão
        const profilePicture = getProfilePictureUrl(req, req.file?.filename);

        user = new User({
            name,
            email,
            password,
            profilePicture,
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
                        photo: user.profilePicture
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
            photo: getProfilePictureUrl(req, user.profilePicture)
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
                        photo: getProfilePictureUrl(req, user.profilePicture)
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};
