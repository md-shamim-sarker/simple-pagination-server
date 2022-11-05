const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
require('colors');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
    try {
        const Products = client.db('daraz').collection('products');

        app.get('/products', async (req, res) => {
            const page = Number(req.query.page);
            const size = Number(req.query.size);
            console.log(page, size);
            const query = {};
            const cursor = Products.find(query);
            const count = await Products.estimatedDocumentCount();
            const products = await cursor.skip((page - 1) * size).limit(size).toArray();
            res.send({products, count});
        });

    } catch(error) {
        console.log(error.name, error.message);
    }
}
run().catch(console.error);

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`.black.bgWhite);
});