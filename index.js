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
    const database = client.db("test"); // Use your correct database name
    const collection = database.collection("studentschemas"); // Use your correct collection name

    // Fetch the data from MongoDB
    const rawData = await collection.find({}).toArray();

    // Flatten the data and remove the _id field or convert it to a string
    const formattedData = rawData.map(item => {
      return {
        id: item._id.toString(),  // Convert _id to string for easier handling
        ...item,                  // Spread other properties into the result
      };
    });

    // Optionally remove the original _id key if it's no longer needed
    formattedData.forEach(item => delete item._id);

    // Send the cleaned, flattened data as JSON response
    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Default port listener (for local dev/testing)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
