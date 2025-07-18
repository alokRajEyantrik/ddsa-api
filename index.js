// index.js
import express from "express";
import { MongoClient } from "mongodb";
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// const client = new MongoClient(process.env.MONGODB_URI);
const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
});

app.use(cors()); 
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is working");
});

app.post("/submit", async (req, res) => {
  try {
    console.log("🔥 Incoming POST data:", req.body);
    await client.connect();
    console.log("✅ MongoDB connected successfully");

    const db = client.db("mydb");
    const collection = db.collection("submissions");

    const result = await collection.insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
