const router=require('express').Router()
const Client = require('../controller/app.controller')

router.get('/',Client.showAll)
router.get('/add',Client.addClient)

router.get('/addPost',Client.addClientPost)
router.post('/addPost',Client.addClientLogic)

router.get('/edit/:accNum',Client.editClient)
router.post('/edit/:accNum',Client.editClientLogic)

router.get('/delete/:accNum',Client.deleteClient)
router.get('/single/:accNum',Client.singleClient)

router.get('/transactionadd/:accNum',Client.transActionAdd)
router.post('/transactionadd/:accNum',Client.transActionAddLogic)
router.get('/transactionWithdraw/:accNum',Client.transactionWithdraw)
router.post('/transactionWithdraw/:accNum',Client.transactionWithdrawLogic)


module.exports= router