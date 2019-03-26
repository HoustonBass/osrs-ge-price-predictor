const Response = require('../models/response')
const request = require('request')
const syncRequest = require('sync-request')

const baseUrl = 'http://services.runescape.com/m=itemdb_oldschool'
const idRequestUrl = '/api/catalogue/detail.json?item=ITEM_ID'
const maxId = 10
const oneMinute = 60000
const waitMultiplier = 1

let sendingIds;
let ids = []
let itemData = {}
let fetching = false
let lastFetch = new Date() - oneMinute*1.25
let idCount = 0


var osrs = {
    lastFetch: function() { return lastFetch },
    fetching: function() { return fetching },
    ids: function() { return ids },
    fetchIds: fetchIds,
    dataById: dataById
}

function idRequest(id) {
    return idRequestUrl.replace(/ITEM_ID/g, id);
}

function fetchIds() {
    if(lastFetch > new Date() - oneMinute) {
        return;
    }
    lastFetch = new Date()
    fetching = true
    sendingIds = Array.from(Array(maxId),(x,i)=>i+1)
    fetchIdsLoop();
}

function fetchIdsLoop() {
    if(sendingIds.length == 0) {
        fetching = false
        return
    }
    var id = sendingIds.pop()
    console.log(`calling ${id}`);
    fetchIdCallback(id, checkAndContinue);
}

function checkAndContinue(id, err, res, body) {
    if(res.statusCode == 200) {
        if(body == null) {
            sendingIds.push(id)
        } else {
            itemData[id] = body.item
            console.log(body.item.name)
        }
    }
    fetchIdsLoop(sendingIds)
}

function fetchIdCallback(id, callback) {
    request(baseUrl + idRequest(id), {json: true}, (err, res, body) => {
        callback(id, err, res, body);
    })
}

function fetchIdSync(id) {
    var res = syncRequest('GET', baseUrl + idRequest(id));
    return new Response(res.statusCode, JSON.parse(res.getBody('utf8')));
}

function dataById(id) {
    var data = itemData[id]
    if(data == undefined) {
        var res = fetchIdSync(id)
        if(res.status == 200) {
            if(res.body == undefined) {
                return new Response(500, {error: 'Could not reach server right now, try again in 30 seconds'});
            } else {
                itemData[id] = res.body.item
                return new Response(200, res.body.item)
            }
        } else {
            return new Response(400, {error: 'Not valid item id'})
        }
    } else {
        return new Response(200, data)
    }
}

module.exports = osrs
