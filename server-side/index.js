require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const stripe = require("stripe")(process.env.STRIPE_KEY);

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
    const paymentCollection = parcelDB.collection("payments");

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

    app.get("/parcels/:id", async (req, res) => {
      try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid parcel ID" });
        }

        const parcel = await parcelCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!parcel) {
          return res.status(404).json({ message: "Parcel not found" });
        }

        res.status(200).send(parcel);
      } catch (error) {
        res.status(500).json({
          message: "Failed to fetch parcel",
          error,
        });
      }
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

    //after payment
    app.post("/payments", async (req, res) => {
      try {
        const { id, amount, payment_method, transaction_id, email } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid parcel ID" });
        }

        // 1️⃣ Update parcel payment status
        const parcelUpdate = await parcelCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { payment_status: "paid" } },
        );

        if (parcelUpdate.modifiedCount === 0) {
          return res.status(404).json({ message: "Parcel not found" });
        }

        // 2️⃣ Insert payment history
        const paymentData = {
          parcel_id: new ObjectId(id),
          paid_by: email,
          amount,
          payment_method,
          transaction_id,
          paid_at: new Date().toISOString(),
        };

        const paymentResult = await paymentCollection.insertOne(paymentData);

        res.status(201).send(paymentResult);
      } catch (error) {
        res.status(500).json({
          message: "Payment processing failed",
          error,
        });
      }
    });

    // get user payment history
    app.get("/payments", async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({ message: "Email required" });
        }

        const payments = await paymentCollection
          .find({ paid_by: email })
          .sort({ paid_at: -1 })
          .toArray();

        res.status(200).json(payments);
      } catch (error) {
        res.status(500).json({
          message: "Failed to fetch payment history",
          error,
        });
      }
    });

    // stripe payment intent
    app.post("/create-payment-intent", async (req, res) => {
      const parcelAmountInCents = req.body.parcelAmountInCents;
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: parcelAmountInCents,
          currency: "usd",
          payment_method_types: ["card"],
        });

        // Send the client secret to the client
        res.json({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
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
