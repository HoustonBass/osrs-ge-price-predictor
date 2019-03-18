const express    = require('express');        // call express
const router = express.Router();
const osrs = require('./controllers/osrs')

osrs.fetchIds()

router.get('/fetch/ids/:id', (req, res) => {
    var data = fetchBy(req.params.id);
    res.send(data)
})

router.get('/fetch/ids', (req, res) => {
    if(!osrs.fetching()) {
        osrs.fetchIds()
    }
    res.send({"fetching": osrs.fetching(), "lastFetch": osrs.lastFetch(), "ids": osrs.ids()})
})

module.exports = router;
