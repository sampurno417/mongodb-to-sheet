require("dotenv").config(); 
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000; 
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.get("/", (req, res) => {
  res.send("Welcome to the MongoDB to Sheets API! Use /data to get data.");
});

app.get("/data", async (req, res) => {
  try {
    await client.connect();

    const database = client.db("test"); 
    const collection = database.collection("studentschemas");
    const data = await collection.find({}).toArray();

    res.json(data);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {

    await client.close();
  }
});


  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });


module.exports = app;