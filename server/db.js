const mongoose = require("mongoose");
// const mongoURI =  "mongodb+srv://memories-project:memoriesproject123@cluster0.ryutq.mongodb.net/stayhealthyfinal?authSource=admin&replicaSet=atlas-svczjj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
const mongoURI =
  "mongodb+srv://admin-yash:test123@cluster0.ryutq.mongodb.net/notes?retryWrites=true&w=majority";

const connectToMongo = async (retryCount) => {
  const MAX_RETRIES = 3;
  const count = retryCount ?? 0;
  try {
    await mongoose.connect(mongoURI, { dbName: "notes" });
    console.info("Connected to Mongo Successfully");

    return;
  } catch (error) {
    console.error(error);

    const nextRetryCount = count + 1;

    if (nextRetryCount >= MAX_RETRIES) {
      throw new Error("Unable to connect to Mongo!");
    }

    console.info(`Retrying, retry count: ${nextRetryCount}`);

    return await connectToMongo(nextRetryCount);
  }
};

module.exports = connectToMongo;
