const { App } = require("@slack/bolt"); // ExpressReceiver
const cron = require('node-cron');
const { WebClient, LogLevel } = require("@slack/web-api");
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const wellbeingController = require('./controllers/wellbeingController');

require("dotenv").config();


// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN, {
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG
  });
//--------------------------------------
// Sample wellBeing
app.command("/knowledge1", wellbeingController.invoke);
app.shortcut('shortcut1', wellbeingController.shortcutOne);

app.command("/health_tip", wellbeingController.getHealthTip);
app.command("/fact", wellbeingController.getFact);

app.event('reaction_added', wellbeingController.welcomeFact);


/* Ref: https://www.npmjs.com/package/node-cron
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
  */
cron.schedule('*/30 * * * *', function() {
    wellbeingController.welcomeFact({client:webClient}); 
});

//Carbon FootPrint Methods
app.command("/knowledge", wellbeingController.invoke);

app.command("/getonecfp", wellbeingController.getOneCarbonFootprint);
app.command("/getallcfp", wellbeingController.getAllCarbonFootprint);

app.view({ callback_id: 'view_1', type: 'view_submission' }, async ({ ack, body, view, client }) => 
{
    await ack();
});

app.view('view_1', wellbeingController.dataFromView);





//----------------------------------------

/* const webClient = new WebClient(process.env.SLACK_BOT_TOKEN, {
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG
  }); */

/* const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });
  */
//app.message(/^(tip|hello|hey).*/, wellbeingController.message); // doesn't work


(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();


mongoose.connect('mongodb+srv://GreenOhanaApp:ojf2KcuLu4y6lMKt@cluster0.03fld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{ promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
  
// async function main() {
//     const uri = "mongodb+srv://GreenOhanaApp:ojf2KcuLu4y6lMKt@cluster0.03fld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//     const client = new MongoClient(uri);
 
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
 
//         // Make the appropriate DB calls
//         await  listDatabases(client);

//         await createListing(client,
//             {
//                 name: "Not Lovely Loft",
//                 summary: "Not A charming loft in Paris",
//                 bedrooms: 2,
//                 bathrooms: 3
//             }
//         );

//     //await qryDatabases(client);

//     //Call the chat.postMessage method using the WebClient
//     /*const result = await webClient.chat.postMessage({
//         channel: 'hackathon-greenohana',
//         text: "Hello world P"
//     });
//     console.log(result); */
 
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }
// main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


async function createListing(client, newListing){
    const result = await client.db("GreenOhanaAppDB").collection("temp").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}


async function qryDatabases(client){
    var dbo = client.db("GreenOhanaAppDB");
    var query = { name: "Lovely Loft" };
    dbo.collection("temp").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        //client.close();
    });
};