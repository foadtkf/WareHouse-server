const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

// paste the "full driver code example" from mongodb connect to cluster

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sq6of.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("laptopdokan").collection("laptops");
    console.log("Connected");
    app.get("/products", async (req, res) => {
      console.log("query", req.query);
      const query = {};
      const cursor = productCollection.find(query);
      let products;
        products = await cursor.toArray();
      res.send(products);
      // console.log(products)
    });

    app.get("/productcount", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const count = await productCollection.countDocuments();
      res.json({ count });
    });

    app.post("/service", async (req, res) => {
      const newService = req.body;
      const result = await  productCollection.insertOne(newService);
      res.send(result);
    });
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/products/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: ObjectId(id)}
      const result=await productCollection.findOne(query)
      res.send(result)
    })
    app.put('/products/:id',async(req,res)=>{
      const id=req.params.id
      const updatedProduct=req.body
      const filter ={_id:ObjectId(id)}
      const options = { upsert: true }
      const updatedDoc={
        $set:{
          quantity: updatedProduct.quantity
        }
      }
      const result=await productCollection.updateOne(filter,updatedDoc,options)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("laptopdokan server is running");
});
app.listen(port, () => {
  console.log("it is running on ", port);
});
