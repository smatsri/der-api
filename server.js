#!/usr/bin/env node

const express = require("express");
const apiHandler = require('./lib/api').handler
const config = require('./lib/config')

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded());


app.all("/api*", apiHandler);

app.listen(config.port, () =>
  console.log(
    `listening on port: ${config.port}\nbase directory: ${config.baseDir}`
  )
);
