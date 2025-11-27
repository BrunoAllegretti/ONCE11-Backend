const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        // Foto padrão (já que não envia req.file via FormData)
        const profilePicture = 'https://i.imgur.com/4ZQZ4Zr.png';

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
            photo: user.profilePicture
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
                        photo: user.profilePicture
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};
