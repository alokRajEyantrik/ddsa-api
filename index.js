// index.js
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// const client = new MongoClient(process.env.MONGODB_URI);
const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
});

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is working");
// });

// app.post("/submit", async (req, res) => {
//   try {
//     console.log("🔥 Incoming POST data:", req.body);
//     await client.connect();
//     console.log("✅ MongoDB connected successfully");

//     const db = client.db("mydb");
//     const collection = db.collection("submissions");

//     const result = await collection.insertOne({
//       ...req.body,
//       createdAt: new Date(),
//     });
//     res.json({ success: true, insertedId: result.insertedId });
//   } catch (err) {
//     console.error("❌ Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   } finally {
//     await client.close();
//   }
// });

// import express from "express";
// import cors from "cors";

// const app = express();
// const PORT = process.env.PORT || 3000;

// CORS Setup — allow localhost and production domains
const allowedOrigins = [
  "http://localhost:5173",
  "https://yourfrontenddomain.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors()); // <<< This is CRITICAL

app.use(express.json());

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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
