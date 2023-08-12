const cashMethodController = require('../../controllers/outwards/cashMethodController')

const router = require('express').Router()

router.post('/addCashMethod', cashMethodController.addCashMethod)
router.get('/allCashMethods', cashMethodController.getAllCashMethods)

router.get('/:id', cashMethodController.getOneCashMethod)
router.put('/:id', cashMethodController.updateCashMethod)
router.delete('/:id', cashMethodController.deleteCashMethod)

module.exports = router