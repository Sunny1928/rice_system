const controller = require('../../controllers/inwards/otherTradeController')

const router = require('express').Router()

router.post('/addItem', controller.addItem)

router.get('/allItems', controller.getAllItems)
router.get('/allItems/:customer', controller.getAllItemsOfCustomer)
router.get('/lastItem/:customer', controller.getLastItemOfCustomer)
router.get('/allItemsByDates/:dates', controller.getAllItemsOfDates)
router.get('/allItems/:name/:dates', controller.getAllItemsByProduct)

router.get('/:id', controller.getOneItem)
router.put('/:id', controller.updateItem)
router.delete('/:id', controller.deleteItem)

module.exports = router