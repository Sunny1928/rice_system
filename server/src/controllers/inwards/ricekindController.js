const db = require('../../models')

const Item = db.inwardsRiceKinds

// main work

// 1. create item

const addItem = async (req, res) => {
    let info = {
        name: req.body.name,
    }

    try{
        const item = await Item.create(info)
        res.status(200).send(item)
        //console.log(item)
    }catch(err){
        console.log(err)
    }
}

// 2. get all item

const getAllItems = async (req, res) => {
    try{
        let items = await Item.findAll({})
        items.sort((a,b) =>{return a.dataValues.name.localeCompare(b.dataValues.name, "zh-Hant")})
        res.status(200).send(items)
    }catch(err){
        console.log(err)
    }
}

// 3. get single item by id

const getOneItem = async (req, res) => {
    try{
        let id = req.params.id
        let item = await Item.findAll({where: { id: id }})
        res.status(200).send(item)
    }catch(err){
        console.log(err)
    }
}

// 4. update item by id

const updateItem = async (req, res) => {
    try{
        let id = req.params.id
        let item = await Item.update(req.body, {where: { id: id }})
        res.status(200).send(item)
    }catch(err){
        console.log(err)
    }
}

// 5. delete item by id

const deleteItem = async (req, res) => {
    try{
        let id = req.params.id
        await Item.destroy({where: { id: id }})
        res.status(200).send('Item is deleted!')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addItem,
    getAllItems,
    getOneItem,
    updateItem,
    deleteItem
}