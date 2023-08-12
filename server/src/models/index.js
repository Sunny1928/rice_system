const dbConfig = require('../config/config')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.db.DB,
    dbConfig.db.USER,
    dbConfig.db.PASSWORD,
    {
        host: dbConfig.db.HOST,
        dialect: dbConfig.db.dialect,
        port: dbConfig.db.PORT,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            timezone: "+08:00"
        },
        timezone: "+08:00",
        operatorAliases: false,
        pool: {
            max: dbConfig.db.pool.max,
            min: dbConfig.db.pool.min,
            acquire: dbConfig.db.pool.acquire,
            idle: dbConfig.db.pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected')
})
.catch(err => {
    console.log('Error' + err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


db.users = require('./userModel.js')(sequelize, DataTypes)

// outwards
db.products = require('./outwards/productModel.js')(sequelize, DataTypes)
db.customers = require('./outwards/customerModel.js')(sequelize, DataTypes)
db.transports = require('./outwards/transportModel.js')(sequelize, DataTypes)
db.trades = require('./outwards/tradeModel.js')(sequelize, DataTypes)
db.sellUints = require('./outwards/sellUintModel.js')(sequelize, DataTypes)
db.cashMethods = require('./outwards/cashMethodModel.js')(sequelize, DataTypes)

// inwards
db.inwardsCustomers = require('./inwards/customerModel')(sequelize, DataTypes)
db.inwardsRiceTrades = require('./inwards/riceTradeModel')(sequelize, DataTypes)
db.inwardsOtherTrades = require('./inwards/otherTradeModel')(sequelize, DataTypes)
db.inwardsProducts = require('./inwards/productModel')(sequelize, DataTypes)
db.inwardsRiceKinds = require('./inwards/riceKindModel')(sequelize, DataTypes)

// db.sequelize.sync({force:false, alter: true })

db.sequelize.sync({force: false})
.then(() => {
    console.log('yes re-sync done!')
})

module.exports = db