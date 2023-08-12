const db = require('../../models')

const Transport = db.transports

// main work

// 1. create transport

const addTransport = async (req, res) => {
    let info = {
        name: req.body.name,
        license: req.body.license,
        phone: req.body.phone,
    }

    try{
        const transport = await Transport.create(info)
        res.status(200).send(transport)
        //console.log(transport)
    }catch(err){
        console.log(err)
    }
}

// 2. get all transport

const getAllTransports = async (req, res) => {
    try{
        let transports = await Transport.findAll({})
        // console.log(transports)
        transports.sort((a,b) =>{return a.dataValues.name.localeCompare(b.dataValues.name, "zh-Hant")})
        res.status(200).send(transports)
    }catch(err){
        console.log(err)
    }
}

// 3. get single transport by id

const getOneTransport = async (req, res) => {
    try{
        let id = req.params.id
        let transport = await Transport.findAll({where: { id: id }})
        res.status(200).send(transport)
    }catch(err){
        console.log(err)
    }
}

// 4. update transport by id

const updateTransport = async (req, res) => {
    try{
        let id = req.params.id
        let transport = await Transport.update(req.body, {where: { id: id }})
        res.status(200).send(transport)
    }catch(err){
        console.log(err)
    }
}

// 5. delete transport by id

const deleteTransport = async (req, res) => {
    try{
        let id = req.params.id
        await Transport.destroy({where: { id: id }})
        res.status(200).send('Transport is deleted!')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    addTransport,
    getAllTransports,
    getOneTransport,
    updateTransport,
    deleteTransport
}