const Response = require('../models/response')
const request = require('request')
const syncRequest = require('sync-request')

const baseUrl = 'http://services.runescape.com/m=itemdb_oldschool'
const idRequestUrl = '/api/catalogue/detail.json?item=ITEM_ID'
const oneMinute = 60000

let wait = 1
let sendingIds;
let ids = []
let itemData = {}
let fetching = false
let lastFetch = new Date() - oneMinute * 1.25


let osrs = {
    lastFetch: function() { return lastFetch },
    fetching: function() { return fetching },
    ids: function() { return ids },
    fetchIds: fetchIds,
    dataById: (id) => { return itemData[id] }
}

function idRequest(id) {
    return idRequestUrl.replace(/ITEM_ID/g, id);
}

function fetchIds(ids) {
    this.ids = ids
    if(lastFetch > new Date() - oneMinute) {
        return;
    }
    lastFetch = new Date()
    fetching = true
    sendingIds = ids
    fetchIdsLoop();
}

function fetchIdsLoop() {
    if(sendingIds.length == 0) {
        fetching = false
        console.log(`OSRS GE: Finished loading ${ids.length} items`)
        return
    }
    var id = sendingIds.pop()
    request(baseUrl + idRequest(id), {json: true}, (err, res, body) => {
        if(res.statusCode == 200) {
            if(body == null) {
                wait*=1.5
                sendingIds.push(id)
            } else {
                wait *= 0.85
                ids.push(id)
                itemData[id] = body.item
            }
        }
        setTimeout(() => {
            fetchIdsLoop()
        }, wait*100);
    })
}

function fetchIdSync(id) {
    var res = syncRequest('GET', baseUrl + idRequest(id))
    if(res.statusCode == 200) {
        if(res == undefined || res.getBody() == "") {
            return new Response(500, {error: 'Could not reach server right now, try again in 30 seconds'})
        } else {
            return new Response(res.statusCode, JSON.parse(res.getBody('utf8')));
        }
    } else {
        return new Response(res.statusCode, {error: 'Not valid item id'});
    }
}

module.exports = osrs
