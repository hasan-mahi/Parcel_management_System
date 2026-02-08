require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* MongoDB URI */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iafk8rj.mongodb.net/?appName=Cluster0`;

/* Mongo Client */
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/* Routes */
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

/* Connect DB & Start Server */
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully");

    const parcelDB = client.db("parcelDB");
    const parcelCollection = parcelDB.collection("parcels");

    app.get("/parcels", async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }

        const result = await parcelCollection
          .find({ created_by: email })
          .sort({ creation_date: -1 }) // latest first
          .toArray();

        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch parcels", error });
      }
    });

    app.post("/parcels", async (req, res) => {
      const newParcel = req.body;
      const result = await parcelCollection.insertOne(newParcel);
      res.status(201).send(result);
    });

    app.delete("/parcels/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const result = await parcelCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.status(200).send(result);
      } catch (error) {
        res.status(500).json({
          message: "Failed to delete parcel",
          error,
        });
      }
    });

    app.listen(PORT, () => {
      console.log(`🔥 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();
