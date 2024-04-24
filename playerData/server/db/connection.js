import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("user").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("PlayerData");

export default db;



/*
import {mongoose} from "mongoose";

async function mongooseConnect() {
  await mongoose.connect(uri);
}

mongooseConnect().catch((err) => console.log(err));

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
  last_name: String,
  first_name: String,
});

const ActorModel = mongoose.model("ActorModel", ActorSchema);

const actor_instance = new ActorModel({ last_name: "last name", first_name: "first name"});
await actor_instance .save();
*/