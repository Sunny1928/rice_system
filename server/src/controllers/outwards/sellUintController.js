const db = require('../../models')

const SellUint = db.sellUints

// main work

// 1. create sellUint

const addSellUint = async (req, res) => {
    let info = {
        name: req.body.name
    }

    try{
        const sellUint = await SellUint.create(info)
        res.status(200).send(sellUint)
        //console.log(sellUint)
    }catch(err){
        console.log(err)
    }
}

// 2. get all sellUint

const getAllSellUints = async (req, res) => {
    try{
        let sellUints = await SellUint.findAll({})
        sellUints.sort((a,b) =>{return a.dataValues.name.localeCompare(b.dataValues.name, "zh-Hant")})
        res.status(200).send(sellUints)
    }catch(err){
        console.log(err)
    }
}

// 3. get single sellUint by id

const getOneSellUint = async (req, res) => {
    try{
        let id = req.params.id
        let sellUint = await SellUint.findAll({where: { id: id }})
        res.status(200).send(sellUint)
    }catch(err){
        console.log(err)
    }
}

// 4. update sellUint by id

const updateSellUint = async (req, res) => {
    try{
        let id = req.params.id
        let sellUint = await SellUint.update(req.body, {where: { id: id }})
        res.status(200).send(sellUint)
    }catch(err){
        console.log(err)
    }
}

// 5. delete sellUint by id

const deleteSellUint = async (req, res) => {
    try{
        let id = req.params.id
        await SellUint.destroy({where: { id: id }})
        res.status(200).send('SellUint is deleted!')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addSellUint,
    getAllSellUints,
    getOneSellUint,
    updateSellUint,
    deleteSellUint
}