import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost",
  "http://localhost:5173",
  "https://localhost",
  "https://localhost:5173",
  "capacitor://localhost",
  "ionic://localhost",
  "https://ddsa-api-1.onrender.com"
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or CURL)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("⛔ Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  // only if you're managing auth/session tokens
  })
);

// 🧪 Optional: handle preflight OPTIONS requests manually (if needed)
app.options("/*all", cors()); // ✅ Valid + avoids 'path-to-regexp' crash


// ✅ Body parser
app.use(express.json());

// ✅ MongoDB
const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
});

// ✅ Routes
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

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
