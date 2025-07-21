// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS properly
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:5173",
      "capacitor://localhost",
      "ionic://localhost",
      "https://ddsa-api-1.onrender.com", // Optional if you're doing frontend SSR
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// app.options("*", cors());

app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
});

app.get("/", (req, res) => {
  res.send("API is working");
});

app.post("/submit", async (req, res) => {
  try {
    await client.connect();
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
