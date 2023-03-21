const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const fs = require('fs');

const {MongoClient,ObjectId} = require('mongodb');
const MONGODB_DB_NAME = 'clearfashion';

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

async function connectToMongo() {
  // Connection URL
  const uri = `mongodb+srv://nico:test@clearfashion.xamlsbk.mongodb.net/test?retryWrites=true&w=majority`;

  // Create a new MongoClient
  client = new MongoClient(uri);

  // Connect to the MongoDB Atlas cluster
  client.connect(err => {
      if (err) {
          console.error('Error connecting to MongoDB Atlas:', err);
          return;
      }
      
      // Connected successfully
      console.log('Connected to MongoDB Atlas');  
  });
  db =  client.db(MONGODB_DB_NAME);
  collection = db.collection('products');
}

app.get('/products/search', async (request, response) => {
  try{
    await connectToMongo();
    const lim = request.query.limit || 12;
    const brand = request.query.brand || undefined;
    const price = request.query.price || undefined;
    const query = {};
    if (brand !== undefined) {
      query.brand = brand;
    }
    // return all products with price less than or equal to the given price
    if (price !== undefined) {
      query.price = {$lte: parseFloat(price)};
    }
    const serchresult = await collection.find(query).limit(parseInt(lim)).toArray();
    response.send(serchresult);
  } 
  catch (error) {
    console.log(error);
  }
});

app.get('/products/:id', async (request, response) => {
  try{
    await connectToMongo();
    const id = request.params.id;
    const serchresult = await collection.findOne({_id: ObjectId(id)});
    response.send(serchresult);
  } catch (error) {
    console.log(error);

  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

// Voici mon adresse de server : https://server-nlsferrara.vercel.app/