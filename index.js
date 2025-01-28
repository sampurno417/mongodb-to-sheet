require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Error: MONGO_URI is not defined. Please check your environment variables.");
  process.exit(1);
}

const client = new MongoClient(uri);

app.get("/", (req, res) => {
  res.send("Welcome to the MongoDB to Sheets API! Use /data to fetch data.");
});

app.get("/data", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("test"); // Use your correct database
    const collection = database.collection("studentschemas"); // Use your correct collection

    const data = await collection.find({}).toArray();
    res.json(data); // Send data as JSON response
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
