const db = require('../../models')

const Customer = db.customers

// main work

// 1. create customer

const addCustomer = async (req, res) => {
    let info = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        homePhone: req.body.homePhone,
        contact: req.body.contact,
        taxId: req.body.taxId
    }
    try{
        const customer = await Customer.create(info)
        res.status(200).send(customer)
        //console.log(customer)
    }catch(err){
        console.log(err)
    }
}

// 2. get all customer

const getAllCustomers = async (req, res) => {
    try{
        let customers = await Customer.findAll({})
        customers.sort((a,b) =>{return a.dataValues.name.localeCompare(b.dataValues.name, "zh-Hant")})
        res.status(200).send(customers)
    }catch(err){
        console.log(err)
    }
}

// 3. get single customer by id

const getOneCustomer = async (req, res) => {
    try{
        let name = req.params.name
        let customer = await Customer.findAll({where: { name: name }})
        res.status(200).send(customer)
    }catch(err){
        console.log(err)
    }
}

// 4. update customer by id

const updateCustomer = async (req, res) => {
    try{
        let id = req.params.id
        let customer = await Customer.update(req.body, {where: { id: id }})
        res.status(200).send(customer)
    }catch(err){
        console.log(err)
    }
}

// 5. delete customer by id

const deleteCustomer = async (req, res) => {
    try{
        let id = req.params.id
        await Customer.destroy({where: { id: id }})
        res.status(200).send('Customer is deleted!')
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    addCustomer,
    getAllCustomers,
    getOneCustomer,
    updateCustomer,
    deleteCustomer
}