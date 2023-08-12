const db = require('../../models')

const Item = db.inwardsOtherTrades
const Op = db.Sequelize.Op;

// main work

// 1. create item

const addItem = async (req, res) => {
    let info = {
        name: req.body.name,
        number: req.body.number,
        uintPrice: req.body.uintPrice,
        aTradePrice: req.body.aTradePrice,
        grandPrice: req.body.grandPrice,
        loan: req.body.loan,
        customer_name: req.body.customer_name,
        user_name: req.body.user_name,
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

const getAllItemsByProduct = async (req, res) => {
    let name = req.params.name
    let dates = req.params.dates

    // console.log(name)
    // console.log(dates.slice(0,24))
    // console.log(dates.slice(25,49))

    try{
        let items = await Item.findAll({
            where: { 
                name: name, 
                made_date: { 
                    [Op.between]: [dates.slice(0,24), dates.slice(25,49)]       
                },
            },
            order: [['made_date', 'DESC'], ['createdAt', 'DESC']]
        })

        // re calculate sum
        let sum = 0
        for(let i = items.length-1; i>=0; i--){
            sum += items[i].aTradePrice
            items[i].grandPrice = sum
        }

        res.status(200).send(items)

    }catch(err){
        console.log(err)
    }
}

// 4. get single item by id

const getOneItem = async (req, res) => {
    try{
        let id = req.params.id
        let item = await Item.findAll({where: { id: id }})
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
            },
        }})
        items.sort((a,b) =>{return a.dataValues.customer_name.localeCompare(b.dataValues.customer_name, "zh-Hant")})
        res.status(200).send(items)
    }catch(err){
        console.log(err)
    }
}

// 9. get customer's last trade

const getLastItemOfCustomer = async (req, res) => {
    try{
        let customer = req.params.customer
        // let items = await Item.findAll({where: { customer_name: customer }})
        console.log("item")
        
        let item = await Item.findOne({
            where: { customer_name: customer }, 
            order: [ [ 'made_date', 'DESC' ], ['createdAt', 'DESC']],
        });
        // console.log(item)
        res.status(200).send(item)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addItem,
    getAllItems,
    getAllItemsByProduct,
    getOneItem,
    updateItem,
    deleteItem,
    getAllItemsOfCustomer,
    getAllItemsOfDates,
    getLastItemOfCustomer
}