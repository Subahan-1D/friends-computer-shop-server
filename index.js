const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 9000;

const corsOptions = {
  origin: ["http://localhost:5173", "https://assignment-11-b49bc.web.app"],
  credentials: true,
  optionSuccessStatus: 200,
};

//MIDDLEWARE
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// start mongodb

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASSWORD}@cluster0.yqmtelq.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const shopsCollection = client
      .db("friendsComputer")
      .collection("serviceItem");
    const bidsCollection = client
      .db("friendsComputer")
      .collection("serviceBids");

    // jwt generate
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "1h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    //Get all ServicesItem data from db
    app.get("/serviceItem", async (req, res) => {
      const result = await shopsCollection.find().toArray();
      res.send(result);
    });
    //get a single data from database
    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await shopsCollection.findOne(query);
      res.send(result);
    });

    // save a item data in db
    app.post("/item", async (req, res) => {
      const itemData = req.body;
      const result = await bidsCollection.insertOne(itemData);
      res.send(result);
    });
    // save a query service item data in db
    app.post("/query", async (req, res) => {
      const queryData = req.body;
      const result = await shopsCollection.insertOne(queryData);
      res.send(result);
    });

    // save a all service item a speacic user
    app.get("/serviceItems/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "user_Info.email": email };
      const result = await shopsCollection.find(query).toArray();
      res.send(result);
    });

    // delete a data from db
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await shopsCollection.deleteOne(query);
      res.send(result);
    });
    // update data from db
    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const itemData = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...itemData,
        },
      };
      const result = await shopsCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // get all item get user by email
    app.get("/recommended-me/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await bidsCollection.find(query).toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("FRIENDS COMPUTER SHOP ");
});

app.listen(port, () => {
  console.log(`FRIENDS COMPUTER SHOP RUNNING : ${port}`);
});
