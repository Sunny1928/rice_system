const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(express.static('dist'));

const corsOptions ={
    origin:['http://localhost:8081', 'http://localhost:8080'], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

//routers
const userRouter = require('./routes/userRouter')

const outwardsProductRouter = require('./routes/outwards/productRouter')
const outwardsCustomerRouter = require('./routes/outwards/customerRouter')
const outwardsTransportRouter = require('./routes/outwards/transportRouter')
const outwardsTradeRouter = require('./routes/outwards/tradeRouter')
const outwardsSellUintRouter = require('./routes/outwards/sellUintRouter')
const outwardsCashMethodRouter = require('./routes/outwards/cashMethodRouter')

const inwardsCustomerRouter = require('./routes/inwards/customerRouter')
const inwardsRiceTradeRouter = require('./routes/inwards/riceTradeRouter')
const inwardsOtherTradeRouter = require('./routes/inwards/otherTradeRouter')
const inwardsProductRouter = require('./routes/inwards/productRouter')
const inwardsRicekindRouter = require('./routes/inwards/ricekindRouter')


const outwardsUrl = '/api/outwards/'
const inwardsUrl = '/api/inwards/'

app.use('/api/users', userRouter)
app.use(outwardsUrl+'products', outwardsProductRouter)
app.use(outwardsUrl+'customers', outwardsCustomerRouter)
app.use(outwardsUrl+'transports', outwardsTransportRouter)
app.use(outwardsUrl+'trades', outwardsTradeRouter)
app.use(outwardsUrl+'sellUints', outwardsSellUintRouter)
app.use(outwardsUrl+'cashMethods', outwardsCashMethodRouter)

app.use(inwardsUrl+'customers', inwardsCustomerRouter)
app.use(inwardsUrl+'ricetrades', inwardsRiceTradeRouter)
app.use(inwardsUrl+'othertrades', inwardsOtherTradeRouter)
app.use(inwardsUrl+'products', inwardsProductRouter)
app.use(inwardsUrl+'ricekinds', inwardsRicekindRouter)




app.post('/register', (req, res)=>{
    res.send({
        message: `Hello ${req.body.account}!`
    })
})

app.listen(process.env.PORT || 80)