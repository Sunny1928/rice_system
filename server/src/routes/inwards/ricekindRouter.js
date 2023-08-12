const controller = require('../../controllers/inwards/ricekindController')

const router = require('express').Router()

router.post('/addItem', controller.addItem)
router.get('/allItems', controller.getAllItems)

router.get('/:id', controller.getOneItem)
router.put('/:id', controller.updateItem)
router.delete('/:id', controller.deleteItem)

module.exports = router