let tips = require('../resources/Tips.json');
let facts = require('../resources/Facts.json');


const invoke = async ({command, ack, say, options}) => {
    console.log('invoked');
    if (!options)
        getOneTip(ack, say);
};


//GET All Tips
const getAllTips = async (ack, say) => {
    console.log('In wellbeing controller');
    await ack();
    say('Tip1, Tip2');
    //res.json({message: ['Tip1', 'Tip2']});
};

//GET one Tip
const getOneTip = async (ack, say) =>  {
    try {
        await ack();
        let randomIndex = Math.floor(Math.random() * tips.length)
        say('Your ' + tips[randomIndex].type + ' tip of the day: ' + tips[randomIndex].message);
    } catch (error) {
        console.log("err");
    }
};

/* 
const message = async ({message, say }) =>  {
    try {
        await ack();
        console.log('In wellbeing controller:'+message);

        await say("hurray! that command works like fire!");
        await say('Tip1');
        // res.json({message: 'Tip1.'});  
    } catch (error) {
        console.log("err")
      console.error(error);
    }
};
*/

const shortcutOne = async ({ shortcut, ack, client, logger }) => {
    console.log('In shorcut one fnction!');
    try { 
        // Acknowledge shortcut request
        await ack();
        client.chat.postMessage({
            channel: 'hackathon-greenohana',
            text: 'Will open this shortcut tomorrow!'
        });
    }  catch (error) {
        console.log("err")
        console.error(error);
    }
}


const returnMessage = async (ack, say, type) =>  {
    try {
        await ack();
        let objs = type == 'health' ? tips : facts;
        let randomIndex = Math.floor(Math.random() * objs.length);
        say((type == 'health' ? 'Health tip' : 'Fact') + ' of the day: ' + objs[randomIndex].message);
    } catch (error) {
        console.log("err");
    }
};

const getHealthTip = async ({command, ack, say, options}) => {
    returnMessage(ack, say, 'health');
};

const getFact = async ({command, ack, say, options}) => {
    returnMessage(ack, say, 'fact');
};

const welcomeFact = async ({ event, client, logger }) => {
    console.log('welcomeFact!');
    let randomIndex = Math.floor(Math.random() * facts.length);
    let user = event ? '<@' + event.user +'>' : 'There';
    client.chat.postMessage({
        channel: 'hackathon-greenohana',
        text: 'Hello ' + user +', Here is a :circle-green: fact for you: ' + facts[randomIndex].message
    });
};

//export controller functions
module.exports = {
    // getAllTips,
    // getOneTip,
    invoke,
    //message,
    shortcutOne,
    getHealthTip,
    getFact,
    welcomeFact
};
