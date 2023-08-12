const db = require('../../models')

const Trade = db.trades
const Op = db.Sequelize.Op;
// main work

// 1. create trade

const addTrade = async (req, res) => {
    let info = {
        name: req.body.name,
        number: req.body.number,
        uint: req.body.uint,
        amount: req.body.amount,
        package: req.body.package,
        totalNumber: req.body.totalNumber,
        sellUint: req.body.sellUint,
        uintPrice: req.body.uintPrice,
        aTradePrice: req.body.aTradePrice,
        grandPrice: req.body.grandPrice,

        customer_name: req.body.customer_name,
        user_name: req.body.user_name,
        pay: req.body.pay,
        transport: req.body.transport,
        comment: req.body.comment,
        made_date: req.body.made_date
    }

    try{
        const trade = await Trade.create(info)
        res.status(200).send(trade)
        //console.log(trade)
    }catch(err){
        console.log(err)
    }
}

// 2. get all trade

const getAllTrades = async (req, res) => {
    try{
        let trades = await Trade.findAll({})
        res.status(200).send(trades)
    }catch(err){
        console.log(err)
    }
}

// 3. get single trade by id

const getOneTrade = async (req, res) => {
    try{
        let id = req.params.id
        let trade = await Trade.findAll({where: { id: id }})
        res.status(200).send(trade)
    }catch(err){
        console.log(err)
    }
}

// 4. update trade by id

const updateTrade = async (req, res) => {
    try{
        let id = req.params.id
        let trade = await Trade.update(req.body, {where: { id: id }, silent: true })
        res.status(200).send(trade)
    }catch(err){
        console.log(err)
    }
}

// 5. delete trade by id

const deleteTrade = async (req, res) => {
    try{
        let id = req.params.id
        await Trade.destroy({where: { id: id }})
        res.status(200).send('Trade is deleted!')
    }catch(err){
        console.log(err)
    }
}

// 6. get customer's all trade

const getAllTradesOfCustomer = async (req, res) => {
    try{
        let customer = req.params.customer
        let trades = await Trade.findAll({
            where: { customer_name: customer}, 
            order: [ [ 'made_date', 'ASC' ], ['createdAt', 'ASC']],
        })
        // trades.sort((a,b) =>{
        //     return new Date(a.dataValues.made_date) - new Date(b.dataValues.made_date)
        // })
        res.status(200).send(trades)
    }catch(err){
        console.log(err)
    }
}

// 7. get all trades by date

const getAllTradesByDate = async (req, res) => {
    try{
        let dates = req.params.dates
        var startDate = new Date(`${dates.slice(0,10)}T00:00:00`)
        var endDate = new Date(`${dates.slice(11,21)}T24:00:00`)

        let trades = await Trade.findAll({where: { 
            made_date: { 
                [Op.between]: [startDate, endDate]       
            }
        }})
        trades.sort((a,b) =>{
            var x= a.dataValues.customer_name.localeCompare(b.dataValues.customer_name, "zh-Hant")
            if(x!== 0) return x 

            return new Date(a.dataValues.made_date) - new Date(b.dataValues.made_date)
        })
        res.status(200).send(trades)
    }catch(err){
        console.log(err)
    }
}

// 8. get cashmethod's all trade

const getAllTradesOfCashmethod = async (req, res) => {
    try{
        let str = req.params.str
        const arr = str.split('&');
        let cashmethod = arr[0];
        let startDate = new Date(`${arr[1].slice(0,10)}T00:00:00`)
        let endDate = new Date(`${arr[1].slice(11,21)}T24:00:00`)
        let trades = []
        if(arr[1] == ''){
            res.status(200).send(trades)
            return
        }
        // console.log(arr)
        // console.log(cashmethod)
        // console.log(startDate)
        // console.log(endDate)
        trades = await Trade.findAll({
            where: {
                name: cashmethod,
                made_date: { 
                    [Op.between]: [startDate, endDate]       
                }
            }, 
            order: [['made_date', 'DESC'], ['createdAt', 'DESC']]
        })

        // re calculate sum
        let sum = 0
        for(let i = trades.length-1; i>=0; i--){
            sum += trades[i].aTradePrice
            trades[i].grandPrice = sum
        }

        res.status(200).send(trades)
        
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addTrade,
    getAllTrades,
    getOneTrade,
    updateTrade,
    deleteTrade,
    getAllTradesOfCustomer,
    getAllTradesByDate,
    getAllTradesOfCashmethod
}