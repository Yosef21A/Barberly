const mongoose = require('mongoose');
const dbName = process.env.DB;
const username = process.env.ATLAS_USERNAME;
const pw = process.env.ATLAS_PASSWORD;

// Ensure required environment variables are present
if (!dbName || !username || !pw) {
  console.error("Missing required environment variables for database connection.");
  process.exit(1); // Exit if environment variables are missing
}

const uri = `mongodb+srv://${username}:${pw}@cluster.aqqb8bl.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Established a connection to the database"))
  .catch(err => console.log("Something went wrong when connecting to the database", err));
