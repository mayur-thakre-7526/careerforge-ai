// Work :->Start server
require("dotenv").config();

const app = require("./src/app.js");
const connectToDB = require("./src/config/databse.js");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is missing.");
    }

    await connectToDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
