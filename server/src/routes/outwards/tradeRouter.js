const tradeController = require('../../controllers/outwards/tradeController')

const router = require('express').Router()

router.post('/addTrade', tradeController.addTrade)

router.get('/allTrades', tradeController.getAllTrades)
router.get('/allTrades/:customer', tradeController.getAllTradesOfCustomer)
router.get('/allTradesByDates/:dates', tradeController.getAllTradesByDate)
router.get('/allTradesByCashmethod/:str', tradeController.getAllTradesOfCashmethod)


router.get('/:id', tradeController.getOneTrade)
router.put('/:id', tradeController.updateTrade)
router.delete('/:id', tradeController.deleteTrade)

module.exports = router