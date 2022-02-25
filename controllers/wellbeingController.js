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
        //await ack();
        console.log('In wellbeing controller');
        say("hurray! that command works like fire!");
        say('Tip1');
        // res.json({message: 'Tip1.'});  
    } catch (error) {
        console.log("err")
        console.error(error);
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
            text: "Will open this shortcut tomorrow!"
        });
    }  catch (error) {
        console.log("err")
        console.error(error);
    }
}


//export controller functions
module.exports = {
    // getAllTips,
    // getOneTip,
    invoke,
    //message,
    shortcutOne
};
