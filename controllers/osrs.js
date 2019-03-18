
var request = require('request')

const baseUrl = 'http://services.runescape.com/m=itemdb_oldschool'
const idRequest = '/api/catalogue/detail.json?item=itemId'
const maxId = 50
const oneMinute = 60000

let ids = []
let fetching = false
let lastFetch = new Date() - oneMinute*1.25
let idCount = 0


var osrs = {
    lastFetch: function() { return lastFetch },
    fetching: function() { return fetching },
    ids: function() { return ids },
    fetchIds: fetchIds
}

function fetchIds() {
    if(lastFetch > new Date() - oneMinute) {
        return;
    }
    lastFetch = new Date()
    fetching = true
    sendingIDs = Array.from(Array(maxId),(x,i)=>i+1)
    return Promise.all(sendingIDs.map(fetchById)).then((data) => {
        fetching = false
        ids = data.filter(f => f != -1)
        console.log(`Fetched ids: ${ids}`)
    })
}

function fetchById(id) {
    return new Promise((resolve, reject) => {
        request(baseUrl + idRequest.replace(/itemId/g, id), { json: true }, (err, res, body) => {
            if(res.statusCode == 200) {
                console.log(id)
                ids.push(id)
                resolve(data)
            } else {
                resolve(-1)
            }
        });
    })
}


module.exports = osrs
