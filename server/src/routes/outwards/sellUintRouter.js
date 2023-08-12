const sellUintController = require('../../controllers/outwards/sellUintController')

const router = require('express').Router()

router.post('/addSellUint', sellUintController.addSellUint)
router.get('/allSellUints', sellUintController.getAllSellUints)

router.get('/:id', sellUintController.getOneSellUint)
router.put('/:id', sellUintController.updateSellUint)
router.delete('/:id', sellUintController.deleteSellUint)

module.exports = router