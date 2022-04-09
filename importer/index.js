const express = require('express');
const cors = require('cors');

process.title = 'ufirstImporter';

const Importer = require('./importer.js');
const importer = new Importer();

const app = express();

app.use(cors());

app.get("/epa", async (_req, res, next) => {
  try {
    res.header("Content-Type",'application/json');
    const json = await importer.import();
    res.send(json);
  } catch (err) {
    next(err);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});