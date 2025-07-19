// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// app.options('*', cors());


const allowedOrigins = [
  "http://localhost",
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost:8000",
];
app.use((req, res, next) => {
  console.log("--- Request Headers ---");
  console.log(req.headers);
  next();
});

// app.use((req, res, next) => {
//   console.log('Request Origin:', req.headers.origin);
//   next();
// });

// ✅ Enable CORS properly
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type"],
//   })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like from mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
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
  console.log(`🚀 Server running on http://192.168.1.5:${PORT}`);
});
