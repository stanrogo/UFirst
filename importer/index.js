var express = require('express');
var cors = require('cors');

process.title = 'ufirstImporter';

var getJson = require('./importer.js');

var app = express();

app.use(cors());

app.get("/epa", (_req, res, next) => {
    getJson().then((ret) => res.json(ret)).catch((err) => next(err));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});