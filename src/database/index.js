const mongoose = require("mongoose");
const logger = require("../logger");
mongoose.Promise = global.Promise;

async function connectToDatabase() {
  try {
    const connectionString = process.env.DB_URL;
    mongoose.set("strictQuery", false);
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info("Connected to database");
  } catch (e) {
    logger.error(e);
  }
}

module.exports = connectToDatabase;
