const express    = require('express'),
    router = express.Router(),
    osrs = require('./controllers/osrs'),
    Error = require('./models/Error'),
    buddy = require('./controllers/buddy')

buddy.getBulkData()
osrs.fetchIds(buddy.ids())

router.get('/items', (req, res) => {
    // req.query.name
    // res.status(200).send(osrs.)
})

router.get('/ids', (req, res) => {
    var bIds;
    if((bIds = buddy.ids()) != undefined) {
        return res.send({'size': bIds.length, 'ids': bIds})
    }
    var oIds;
    if(oIds = osrs.ids()) {
        return res.send({'size': oIds.length, 'ids':oIds})
    }
    return res.json(new Error("NO_IDS", "Could not get a list of ids :/"))
})

router.get('/ids/:id', (req, res) => {
    var id = validId(req, res)
    if(id == undefined) {
        return
    }

    var idData = buddy.dataById(id)
    if(idData != undefined) {
        return res.status(200).send(idData)
    }

    var oData = osrs.dataById(id)
    if(oData != undefined) {
        return res.status(200).send(oData.body)
    }
    res.status(404).send(new Error("ID_NOT_FOUND", `${id} not found`))
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
