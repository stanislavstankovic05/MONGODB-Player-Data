import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";


const router = express.Router();

// all Players.
router.get("/", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let query = { };
  let results = await collectionPlayer.find(query).toArray();

  console.log(results);
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

// all player by league.

router.get("/getByLeague/:league", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let query=null;
  try{
      query = { league :  req.params.league };
  }
  catch(error){
    console.log(error);
    return;
  }
  let results = await collectionPlayer.find(query).toArray();
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

router.get("/getByRarity/:rarity", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let query=null;
  try{
      query = { rarity :  req.params.rarity };
  }
  catch(error){
    console.log(error);
    return;
  }
  let results = await collectionPlayer.find(query).toArray();
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

router.get("/getByPace/:statsPace", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let query=null;
  try{
      query = { 'stats.pace' :  parseInt(req.params.statsPace) };
  }
  catch(error){
    console.log(error);
    return;
  }
  let results = await collectionPlayer.find(query).toArray();
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

router.get("/pace/:min/:max", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let ovr_min=parseInt(req.params.min);
  let ovr_max=parseInt(req.params.max);
  if(!ovr_min) ovr_min=0;
  if(!ovr_max) ovr_min=99;
  let query1={};
  let query2={};
  if(!isNaN(ovr_min)){
    query1={'stats.pace':{$gte: ovr_min}};
  }
  if(!isNaN(ovr_max)){
    query2={'stats.pace':{$lte: ovr_max}};
  }
  let results = await collectionPlayer.find({ $and: [query1,query2]}).toArray();
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

router.get("/greenLink/:id", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let teamQuery={ _id :  new ObjectId(req.params.id) }
  let ceva=await collectionPlayer.findOne(teamQuery);
  let team=ceva.team;
  console.log(team);
  let query1=null;
  let query2=null;
  try{
      query1 = { team :  ceva.team };
      query2 = { _id :  {$ne: new ObjectId(req.params.id)} };
  }
  catch(error){
    console.log(error);
    return;
  }
  let results = await collectionPlayer.find( {$and: [query1,query2]}).toArray();
  console.log(results);
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

router.get("/yellowLink/:id", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let teamQuery={ _id :  new ObjectId(req.params.id) }
  let ceva=await collectionPlayer.findOne(teamQuery);
  let team=ceva.team;
  console.log(team);
  let query1=null;
  let query2=null;
  let query3=null;
  try{
      query1 = { nationality :  req.team };
      query2 = { _id :  {$ne: new ObjectId(req.params.id)} };
      query2 = { team :  {$ne: req.team} };
  }
  catch(error){
    console.log(error);
    return;
  }
  let results = await collectionPlayer.find( {$and: [query1,query2]}).toArray();
  console.log(results);
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});


router.get("/ovr/:min/:max", async (req, res) => {
  let collectionPlayer = await db.collection("Player");
  let ovr_min=parseInt(req.params.min);
  let ovr_max=parseInt(req.params.max);
  if(!ovr_min) ovr_min=0;
  if(!ovr_max) ovr_min=99;
  let query1={};
  let query2={};
  if(!isNaN(ovr_min)){
    query1={OVR:{$gte: ovr_min}};
  }
  if(!isNaN(ovr_max)){
    query2={OVR:{$lte: ovr_max}};
  }
  let results = await collectionPlayer.find({ $and: [query1,query2]}).toArray();
  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

router.post("/", async (req, res) => {
  try {

    
    let newDocument = {
      
      name: req.body.name,
      rarity: req.body.newDrops,
      age: req.body.age,
      preferred_foot: req.body.preferred_foot,
      league: req.body.league,
      team: req.body.team,
      nationality: req.body.nationality,
      height: req.body.height,
      weight: req.body.weight,
      workrate: req.body.workrate,
      position: req.body.position,
      stats: req.body.stats,
      OVR: req.body.OVR
    };
    console.log(newDocument)
    let collectionMovies = await db.collection("Player");
    let result = await collectionMovies.insertOne(newDocument);
    res.send(result).status(204); //no content to the client
  } catch (err) { 
    console.error(err);
    res.status(500).send("Error adding player");
 }
});


router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    
    const updates = {
      $set: {
        name: req.body.name,
        rarity: req.body.newDrops,
        age: req.body.age,
        preferred_foot: req.body.preferred_foot,
        league: req.body.league,
        team: req.body.team,
        nationality: req.body.nationality,
        height: req.body.height,
        weight: req.body.weight,
        workrate: req.body.workrate,
        position: req.body.position,
        stats: req.body.stats,
        OVR: req.body.OVR
      },
    };
    let collectionPlayer = await db.collection("Player");
    let result = await collectionPlayer.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating monster");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collectionPlayer = db.collection("Player");
    let result = await collectionPlayer.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting monster");
  }
});


export default router;