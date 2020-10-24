#!/usr/bin/env node

const express = require("express");
const cors = require('cors');
const apiHandler = require('./lib/api').handler
const config = require('./lib/config')

const app = express();
app.use(cors({
  credentials: config.origin !== "*",
  origin: config.origin
}));

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded());

app.get('/test', (req, res) => res.send({ ok: true }))
app.use("/api*", apiHandler);



app.listen(config.port, () =>
  console.log(
    `listening on port: ${config.port}\nbase directory: ${config.baseDir}`
  )
);
