require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Error: MONGO_URI is not defined. Please check your environment variables.");
  process.exit(1);
}

const client = new MongoClient(uri);
app.use(express.json()); // Middleware to parse JSON requests

app.get("/", (req, res) => {
  res.send("Welcome to the MongoDB API! Use /verify to check.");
});

app.get("/data", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("test"); // Use your correct database name
    const collection = database.collection("studentschemas"); // Use your correct collection name

    const rawData = await collection.find({}).toArray();

    // Format the data (Convert `_id` to `id` and remove `_id`)
    const formattedData = rawData.map(item => ({
      id: item._id.toString(),
      ...item,
    }));

    formattedData.forEach(item => delete item._id);

    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/verify", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("test");
    const collection = database.collection("studentschemas");

    const { id } = req.body; // Get ID from request body

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if the student exists
    const student = await collection.findOne({ _id: new ObjectId(id) });

    if (!student) {
      return res.status(404).json({ message: "Invalid" });
    }

    res.json({ message: "Valid"});
  } catch (error) {
    console.error("Error verifying student:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.patch("/turnin", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("test");
    const collection = database.collection("studentschemas");

    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find student by ID
    const student = await collection.findOne({ _id: new ObjectId(id) });

    if (!student) {
      return res.status(404).json({ message: "Sorry! Invalid ID." });
    }

    if (student.isVerified === false) {
      // Update student verification status
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isVerified: true } }
      );

      return res.json({ message: "Participant Registerd successfully" });
    } else {
      return res.json({ message: "Student Already Registerd" });
    }
  } catch (error) {
    console.error("Error in /turnin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Default port listener (for local dev/testing)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
