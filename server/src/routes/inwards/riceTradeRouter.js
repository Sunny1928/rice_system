const controller = require('../../controllers/inwards/riceTradeController')

const router = require('express').Router()

router.post('/addItem', controller.addItem)

router.get('/allItems', controller.getAllItems)
router.get('/allItems/:customer', controller.getAllItemsOfCustomer)
router.get('/allItemsByDates/:dates', controller.getAllItemsOfDates)
router.get('/allItems/:name/:dates', controller.getAllItemsByRicekind)

router.get('/:id', controller.getOneItem)
router.put('/:id', controller.updateItem)
router.delete('/:id', controller.deleteItem)

module.exports = router