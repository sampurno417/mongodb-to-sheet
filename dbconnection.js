const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(`mongodb+srv://sampurnosarkarind:wX00hEY8ky3w4NR2@sristidb.3qk5b.mongodb.net/?retryWrites=true&w=majority&appName=sristidb`);
    console.log(
      `database connected: ${connect}`
    );
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};

module.exports = dbConnect;