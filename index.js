const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4d7lh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('warehouse').collection('item');
        const addItemCollection = client.db('warehouse').collection('addItem')

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        app.post('/addItem', async (req, res) => {
            const addItem = req.body;
            const result1 = await itemCollection.insertOne(addItem);
            const result = await addItemCollection.insertOne(addItem);
            res.send(result);

        });
        app.get('/addItem', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = addItemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })

        // Delete
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })



    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running warehouse Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
