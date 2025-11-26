const Product = require("../models/Product");

// Criar um novo produto (acesso protegido)
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
};

// Obter todos os produtos (acesso público)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
};

// Obter um produto por ID (acesso público)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: "Produto não encontrado" });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Produto não encontrado" });
        }
        res.status(500).send("Erro no servidor");
    }
};

// Atualizar um produto (acesso protegido)
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: "Produto não encontrado" });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
};

// Deletar um produto (acesso protegido)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: "Produto não encontrado" });
        }

        await product.deleteOne(); // Usar deleteOne() em vez de remove()

        res.json({ msg: "Produto removido" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Produto não encontrado" });
        }
        res.status(500).send("Erro no servidor");
    }
};
