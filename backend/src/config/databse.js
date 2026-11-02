const mongoose = require("mongoose");

async function connectToDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  await mongoose.connect(mongoUri);
  console.log("Database connected");
}

module.exports = connectToDB;
