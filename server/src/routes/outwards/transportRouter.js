const transportController = require('../../controllers/outwards/transportController')

const router = require('express').Router()

router.post('/addTransport', transportController.addTransport)
router.get('/allTransports', transportController.getAllTransports)

router.get('/:id', transportController.getOneTransport)
router.put('/:id', transportController.updateTransport)
router.delete('/:id', transportController.deleteTransport)

module.exports = router