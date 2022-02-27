var mongoose = require('mongoose');
var Event = require('../models/EventsModel.js');

const invoke = async ({command, ack, say, body, client, logger}) => {
    getEventsList(ack, say, body, client, logger);
};

//GET events list
const getEventsList = async ({ack, say ,body, client, logger}) =>  {
    try {
        await ack();
        // Call the users.info method using the WebClient
        const result1 = await client.users.info({user: userId});
        collection_name = 'Events';
        const query_result = await qryDatabases(client, collection_name);
        //console.log(query_result);
        //const result = await client.users.info({user: userId});
        const res = await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                "title": {
                "type": "plain_text",
                "text": "Events List",
                "emoji": true
                },
                "type": "modal",
                "callback_id": "view_2",
                "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": query_result[0].startdate+" "+query_result[0].name
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Take me there :athletic_shoe:",
                            "emoji": true
                        },
                        "value": "click_me_123",
                        "url": query_result[0].event_link,
                        "action_id": "button-action"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": query_result[1].startdate+" "+query_result[1].name
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Take me there :athletic_shoe:",
                            "emoji": true
                        },
                        "value": "click_me_123",
                        "url": query_result[1].event_link,
                        "action_id": "button-action"
                    }
                }
                ]
            }
        });
        //await populateModal(query_result);
    } catch (error) {
        console.log("err");
    }
};

async function qryDatabases(client, collection_name){
    //const db = client.db('GreenOhanaAppDB');
    //var term = query_term.toString();
    //var query = { 'name':query_term.toString() };
    //const items = await db.collection(collection_name).find().toArray();
    try 
    { 
        Event.find(function (err, items) {
            if (err) {
                // return next(err);
                console.log(err);
            }
            console.log(items);
        });
    } 
    catch (error) 
    {
        console.error(error);
    }
    items.sort(function(a, b) {
        var keyA = new Date(a.startdate),
          keyB = new Date(b.startdate);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    // return items;
    //console.log(items);
    console.log('q res in qry method is '+JSON.stringify(items));
    return items;
    // close connection
    //client.close();
};

module.exports = {
    // getAllTips,
    // getOneTip,
    invoke
};