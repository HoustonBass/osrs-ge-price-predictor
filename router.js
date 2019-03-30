const express    = require('express');        // call express
const router = express.Router();
const osrs = require('./controllers/osrs')

osrs.fetchIds()

router.get('/items', (req, res) => {
    // req.query.name
    // res.status(200).send(osrs.)
})

router.get('/ids', (req, res) => {
    res.send({'ids':osrs.ids()})
})

router.get('/ids/:id', (req, res) => {
    var id = validId(req, res)
    var data = osrs.dataById(id)
    res.status(data.status).send(data.body)
})

router.get('/ids/:id/price', (req, res) => {
    var id = validId(req, res)
    var data = osrs.dataById(id)
    if(data.status == 200) {
        res.send(data.body.current)
    } else {
        res.status(data.status).send(data.body)
    }
})

router.post('/ids/fetch', (req, res) => {
    if(!osrs.fetching()) {
        osrs.fetchIds()
    }
    res.send({"fetching": osrs.fetching(), "lastFetch": osrs.lastFetch(), "ids": osrs.ids()})
})

function validId(req, res) {
    var id = parseInt(req.params.id)
    if(isNaN(id)) {
        res.status(400).send({'error':'Not valid integer format'})
    }
    return id;
}

module.exports = router;
