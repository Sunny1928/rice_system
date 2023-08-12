const db = require('../models')
const User = db.users

// jwt
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser(user){
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user.toJSON(), config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

// main work
 
// login

const login = async (req, res) => {
    const {account, password} = req.body
    const user = await User.findOne({where:{account: account}})
    if(!user){
        return res.status(403).send({
            error: 'The account does not exist'
        })
    }
    const isPasswordVaild = await user.comparePassword(password)
    
    if(!isPasswordVaild){
        return res.status(403).send({
            error: 'The login password was incorrect'
        })
    }

    res.status(200).send({
        user: user,
        token: jwtSignUser(user)
    })
    //console.log(user)
}

// 1. create user

const addUser = async (req, res) => {
    let info = {
        account: req.body.account,
        password: req.body.password
    }
    
    try{
        const user = await User.create(info)
        res.status(200).send(user)
    }catch(err){
        console.log(err)
    }
    //console.log(user)

    // try{
    //     const user = await User.create(res.body)
    //     res.send(user)
    // }catch(err){
    //     res.status(400).send({
    //         error: 'this is in use.'
    //     })
    // }
}

// 2. get all user

const getAllUsers = async (req, res) => {
    try{
        let users = await User.findAll({})
        res.status(200).send(users)
    }catch(err){
        console.log(err)
    }
}

// 3. get single user by id

const getOneUser = async (req, res) => {
    try{
        let id = req.params.id
        let user = await User.findAll({where: { id: id }})
        res.status(200).send(user)
    }catch(err){
        console.log(err)
    }
}

// 4. update user by id

const updateUser = async (req, res) => {
    try{
        let id = req.params.id
        let user = await User.update(req.body, {where: { id: id }})
        res.status(200).send(user)
    }catch(err){
        console.log(err)
    }
}

// 5. delete user by id

const deleteUser = async (req, res) => {
    try{
        let id = req.params.id
        await User.destroy({where: { id: id }})
        res.status(200).send('User is deleted!')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    login,
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}