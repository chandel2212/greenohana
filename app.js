const { App } = require("@slack/bolt"); // ExpressReceiver
const cron = require('node-cron');
const { WebClient, LogLevel } = require("@slack/web-api");
const wellbeingController = require('./controllers/wellbeingController');


require("dotenv").config();
const {MongoClient} = require('mongodb');
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

cron.schedule('* * * * *', function() {
    wellbeingController.welcomeFact({client:webClient});
});

//Carbon FootPrint Methods



// Calendar Methods


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

async function main() {
    const uri = "mongodb+srv://GreenOhanaApp:ojf2KcuLu4y6lMKt@cluster0.03fld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);

        await createListing(client,
            {
                name: "Not Lovely Loft",
                summary: "Not A charming loft in Paris",
                bedrooms: 2,
                bathrooms: 3
            }
        );

        //await qryDatabases(client);

    //Call the chat.postMessage method using the WebClient
    /*const result = await webClient.chat.postMessage({
        channel: 'hackathon-greenohana',
        text: "Hello world P"
    });
    console.log(result); */
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);

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