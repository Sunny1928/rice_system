const db = require('../../models')

const CashMethod  = db.cashMethods

// main work

// 1. create cashMethod

const addCashMethod  = async (req, res) => {
    let info = {
        name: req.body.name,
        ratio: req.body.ratio
    }
    try{
        const cashMethod = await CashMethod .create(info)
        res.status(200).send(cashMethod)
        //console.log(cashMethod)
    }catch(err){
        console.log(err)
    }
}

// 2. get all cashMethod

const getAllCashMethods = async (req, res) => {
    try{
        let cashMethods = await CashMethod .findAll({})
        cashMethods.sort((a,b) =>{return a.dataValues.name.localeCompare(b.dataValues.name, "zh-Hant")})
        res.status(200).send(cashMethods)
    }catch(err){
        console.log(err)
    }
}

// 3. get single cashMethod by id

const getOneCashMethod  = async (req, res) => {
    try{
        let id = req.params.id
        let cashMethod = await CashMethod .findAll({where: { id: id }})
        res.status(200).send(cashMethod)
    }catch(err){
        console.log(err)
    }
}

// 4. update cashMethod by id

const updateCashMethod = async (req, res) => {
    try{
        let id = req.params.id
        let cashMethod = await CashMethod .update(req.body, {where: { id: id }})
        res.status(200).send(cashMethod)
    }catch(err){
        console.log(err)
    }
}

// 5. delete cashMethod  by id

const deleteCashMethod  = async (req, res) => {
    try{
        let id = req.params.id
        await CashMethod .destroy({where: { id: id }})
        res.status(200).send('CashMethod  is deleted!')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addCashMethod ,
    getAllCashMethods,
    getOneCashMethod ,
    updateCashMethod ,
    deleteCashMethod 
}