const db = require('../../models')

const Product = db.products

// main work

// 1. create product

const addProduct = async (req, res) => {
    let info = {
        name: req.body.name,
        full_name: req.body.full_name,
        price: req.body.price,
        uint: req.body.uint,
        number: req.body.number,
        sellUint: req.body.sellUint
    }
    try{
        const product = await Product.create(info)
        res.status(200).send(product)
        console.log(product)
    }catch(err){
        console.log(err)
    }
}

// 2. get all product

const getAllProducts = async (req, res) => {
    try{
        let products = await Product.findAll({})
        products.sort((a,b) =>{return a.dataValues.name.localeCompare(b.dataValues.name, "zh-Hant")})
        res.status(200).send(products)
    }catch(err){
        console.log(err)
    }
}

// 3. get single product by id

const getOneProduct = async (req, res) => {
    try{
        let id = req.params.id
        let product = await Product.findAll({where: { id: id }})
        res.status(200).send(product)
    }catch(err){
        console.log(err)
    }
}

// 4. update product by id

const updateProduct = async (req, res) => {
    try{
        let id = req.params.id
        let product = await Product.update(req.body, {where: { id: id }})
        res.status(200).send(product)
    }catch(err){
        console.log(err)
    }
}

// 5. delete product by id

const deleteProduct = async (req, res) => {
    try{
        let id = req.params.id
        await Product.destroy({where: { id: id }})
        res.status(200).send('Product is deleted!')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct
}