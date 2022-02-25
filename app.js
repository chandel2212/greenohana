const { App } = require("@slack/bolt");
require("dotenv").config();
const {MongoClient} = require('mongodb');
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

app.command("/knowledge", async ({ command, ack, say }) => {
    try {
      await ack();
      say("hurray! that command works like fire!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

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