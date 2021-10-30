const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares //
app.use(cors());
app.use(express.json());

// setup mongoDB //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3myda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Shift-us");
    const serviceCollection = database.collection("services");
    const bookingCollection = database.collection("bookings");
    // GET API
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/regService/:email", async (req, res) => {
      const query = { email: req.params.email };
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/regServices", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // POST API
    app.post("/regService", async (req, res) => {
      const result = await bookingCollection.insertOne(req.body);
      res.json(result);
    });
    app.post("/services", async (req, res) => {
      const result = await serviceCollection.insertOne(req.body);
      res.json(result);
    });
    // UPDATE API
    app.put("/regServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateStatus = {
        $set: {
          status: "Approved"
        }
      }
      const result = await bookingCollection.updateOne(query,updateStatus);
      res.json(result);
    });
    // DELETE API
    app.delete("/myBookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
    app.delete("/regServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to server");
});

app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`);
});
