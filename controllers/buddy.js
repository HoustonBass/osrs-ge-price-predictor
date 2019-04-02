const syncRequest = require('sync-request')

const rsbuddySummary = 'https://rsbuddy.com/exchange/summary.json'

let ids = []
let itemData = {}
let nameIdMap = {}

let buddy = {
    ids: () => { return ids },
    getBulkData: getBulkData,
    nameById: (id) => { return itemData[id].name },
    dataById: (id) => { return itemData[id] },
    idByName: (name) => { return "WIP" }
}

function getBulkData() {
    var res = syncRequest('GET', rsbuddySummary)

    if(res.statusCode == 200) {
        var stringData = res.getBody('utf8')
        var data = JSON.parse(stringData)

        ids = Object.keys(data)
        itemData = data
        console.log(`Buddy: Finished loading ${ids.length} items`)
    }
}

module.exports = buddy
