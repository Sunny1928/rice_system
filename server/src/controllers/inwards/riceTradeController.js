const db = require('../../models')

const Item = db.inwardsRiceTrades
const Op = db.Sequelize.Op;

// main work

// 1. create item

const addItem = async (req, res) => {
    let info = {
        turn_id: req.body.turn_id,
        name: req.body.name,
        in: req.body.in,
        out: req.body.out,
        stock: req.body.stock,
        customer_name: req.body.customer_name,
        another_customer_name: req.body.another_customer_name,
        user_name: req.body.user_name,
        go: req.body.go,
        comment: req.body.comment,
        made_date: req.body.made_date
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
        res.status(200).send(items)
    }catch(err){
        console.log(err)
    }
}

// 3. get one kind

const getAllItemsByRicekind = async (req, res) => {
    try{
        let name = req.params.name
        let dates = req.params.dates
        console.log(name)
        console.log(dates.slice(0,24))
        console.log(dates.slice(25,49))

        let items = await Item.findAll({
        where: { 
            name: name, 
            made_date: { 
                [Op.between]: [dates.slice(0,24), dates.slice(25,49)]       
            }
        }})
        res.status(200).send(items)
    }catch(err){
        console.log(err)
    }
}

// 4. get single item by id

const getOneItem = async (req, res) => {
    try{
        let id = req.params.id
        let item = await Item.findOne({where: { id: id }})
        res.status(200).send(item)
    }catch(err){
        console.log(err)
    }
}

// 5. update item by id

const updateItem = async (req, res) => {
    try{
        let id = req.params.id
        let item = await Item.update(req.body, {where: { id: id }})
        res.status(200).send(item)
    }catch(err){
        console.log(err)
    }
}

// 6. delete item by id

const deleteItem = async (req, res) => {
    try{
        let id = req.params.id
        await Item.destroy({where: { id: id }})
        res.status(200).send('Item is deleted!')
    }catch(err){
        console.log(err)
    }
}

// 7. get customer's all trade

const getAllItemsOfCustomer = async (req, res) => {
    try{
        let customer = req.params.customer
        let items = await Item.findAll({
            where: { customer_name: customer },
            order: [ [ 'made_date', 'ASC' ], ['createdAt', 'ASC']],
        })
        // items.sort((a,b) =>{
        //     return new Date(a.dataValues.made_date) - new Date(b.dataValues.made_date)
        // })
        res.status(200).send(items)
    }catch(err){
        console.log(err)
    }
}

// 8. get all trade by dates

const getAllItemsOfDates = async (req, res) => {
    try{
        let dates = req.params.dates
        // console.log(dates.slice(0,10))
        // console.log(dates.slice(11,21))
        var startDate = new Date(`${dates.slice(0,10)}T00:00:00`)
        var endDate = new Date(`${dates.slice(11,21)}T24:00:00`)

        let items = await Item.findAll({where: { 
            made_date: { 
                [Op.between]: [startDate, endDate]       
            }
        }})
        items.sort((a,b) =>{return a.dataValues.customer_name.localeCompare(b.dataValues.customer_name, "zh-Hant")})
        res.status(200).send(items)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addItem,
    getAllItems,
    getAllItemsByRicekind,
    getOneItem,
    updateItem,
    deleteItem,
    getAllItemsOfCustomer,
    getAllItemsOfDates
}