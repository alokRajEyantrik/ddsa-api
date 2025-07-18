import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await client.connect();
    const db = client.db("formdb");
    const collection = db.collection("submissions");

    const body = req.body ?? JSON.parse(req.rawBody);
    await collection.insertOne({ ...body, submittedAt: new Date() });
    console.log("Submission received:");
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting form" });
  } finally {
    await client.close();
  }
}
