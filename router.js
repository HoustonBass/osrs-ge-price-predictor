const express    = require('express');        // call express
const router = express.Router();
const osrs = require('./controllers/osrs')

osrs.fetchIds()

router.get('/ids', (req, res) => {
    res.send({'ids':osrs.ids()})
})

router.get('/ids/:id', (req, res) => {
    var id = validId(req, res)
    osrs.fetchById(id).then(data => {
        if(data == -1) {
            res.status(400).send({'error': 'Not valid item id'})
        }
        res.send(data)
    })
})

router.get('/ids/:id/price', (req, res) => {
    var id = validId(req, res)
    osrs.fetchById(id).then(data => {
        if(data == -1) {
            res.status(400).send({'error': 'Not valid item id'})
        }
        res.send(data.item.current.price)
    })
})

router.get('/ids/fetch', (req, res) => {
    res.send(req.query)
    // if(!osrs.fetching()) {
    //     osrs.fetchIds()
    // }
    // res.send({"fetching": osrs.fetching(), "lastFetch": osrs.lastFetch(), "ids": osrs.ids()})
})

function validIf(req, res) {
    var id = parseInt(req.params.id)
    if(isNaN(id)) {
        res.status(400).send({'error':'Not valid integer format'})
    }
    return id;
}

module.exports = router;
