const express = require("express")
const bodyParser = require("body-parser")
// const elasticsearch = require("elasticsearch")
const app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT || 3000, () => {
    console.log("connected")
})

// const esClient = elasticsearch.Client({
//     host: "http://0.0.0.0:9200",
// })
const Client = require('@elastic/elasticsearch').Client;
const esClient = new Client({
//   cloud: { id: '<cloud-id>' },
//   auth: { apiKey: 'base64EncodedKey' }
cloud: { id: 'test' },
auth: {
    username: 'elastic',
    password: 'HKIYI6Ke7F2uhT4D4gPpEEiF'
  }
})

app.get('/', (req, res) => {
    res.send('hello world')
  })
app.post("/products", (req, res) => {
    esClient.index({
        index: 'products',
        body: {
            "id": req.body.id,
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
        }
    })
    .then(response => {
        return res.json({"message": "Indexing successful"})
    })
    .catch(err => {
         return res.status(500).json({"message": "Error"})
    })
})

app.get("/products", (req, res) => {
    const searchText = req.query.text
    esClient.search({
        index: "products",
        body: {
            query: {
                match: {"name": searchText? searchText.trim(): ''}
            }
        }
    })
    .then(response => {
        return res.json(response)
    })
    .catch(err => {
        return res.status(500).json({"message": "Error"})
    })
})