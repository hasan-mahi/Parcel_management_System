require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");

const app = express();

const stripe = require("stripe")(process.env.STRIPE_KEY);

/* Middlewares */
app.use(cors());
app.use(express.json());

const serviceAccount = require("./firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
    const userCollection = parcelDB.collection("users");
    const riderCollection = parcelDB.collection("riders");

    const verifyToken = async (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
      }

      // token verify
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.decoded = decoded;
        next();
      } catch (error) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
    };

    app.post("/users", async (req, res) => {
      const email = req.body.email;
      const userExist = await userCollection.findOne({ email });

      if (userExist) {
        return res.status(200).send({ message: "user exist", inserted: false });
      }

      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/parcels", verifyToken, async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }

        if (req.decoded.email !== email) {
          return res.status(403).send({ message: "Forbidden Access" });
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

    app.post("/riders", async (req, res) => {
      const rider = req.body;
      const result = await riderCollection.insertOne(rider);
      res.send(result);
    });

    app.get("/riders", async (req, res) => {
      try {
        const { status } = req.query; // get status from query params, e.g., ?status=approved
        let query = {};

        if (status) {
          query.status = status; // filter by status if provided
        }

        const result = await riderCollection.find(query).toArray();

        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({
          message: "Failed to load riders",
          error,
        });
      }
    });

    app.patch("/riders/:id", async (req, res) => {
      const { id } = req.params;
      const updates = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid rider ID" });
      }

      try {
        const result = await riderCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates },
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Rider not found" });
        }

        const updatedRider = await riderCollection.findOne({
          _id: new ObjectId(id),
        });

        res.json(updatedRider);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update rider" });
      }
    });

    app.post("/tracking", async (req, res) => {
      try {
        const {
          parcelId,
          tracking_id,
          status,
          message,
          updated_by = "",
        } = req.body;

        if (!ObjectId.isValid(parcelId)) {
          return res.status(400).json({ message: "Invalid parcel ID" });
        }

        const trackingData = {
          parcel_id: new ObjectId(parcelId),
          tracking_id,
          status,
          message,
          updated_by,
          time: new Date(),
        };

        // Insert tracking history
        const result = await trackingCollection.insertOne(trackingData);

        // Update current parcel status
        await parcelCollection.updateOne(
          { _id: new ObjectId(parcelId) },
          { $set: { status } },
        );

        res.status(201).json({
          message: "Tracking updated successfully",
          trackingId: result.insertedId,
        });
      } catch (error) {
        res.status(500).json({
          message: "Failed to update tracking",
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
    app.get("/payments", verifyToken, async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.status(400).json({ message: "Email required" });
        }

        if (req.decoded.email !== email) {
          return res.status(403).send({ message: "Forbidden Access" });
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
