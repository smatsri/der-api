#!/usr/bin/env node

const express = require("express");
const fs = require("fs-extra");
const fsPath = require("path");
const options = require("yargs")
  .options({
    port: {
      type: "number",
      default: 3000,
      describe: "port to user"
    },
    baseDir: {
      type: "string",
      default: "./api",
      describe: "directory base"
    }
  })
  .help().argv;

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded());

const getAvailablePaths = (path, verb) => {
  let paths = [`${path}.${verb}.json`, `${path}/${verb}.json`];

  if (verb === "get") {
    paths = paths.concat([`${path}.json`, `${path}/index.json`]);
  } else if (verb === "post") {
  }

  paths = paths.map(p => fsPath.join(options.baseDir, p));

  return paths;
};

const getJson = async (path, verb) => {
  let paths = getAvailablePaths(path, verb);
  let match;
  for (const path of paths) {
    const exists = await fs.exists(path);
    if (exists) {
      match = path;
      break;
    }
  }

  if (match) {
    const json = await fs.readJSON(match);
    return json;
  }

  throw { message: "json not found" };
};

const isMatch = (a, b) => {
  for (const key of Object.keys(a)) {
    if (a[key] != b[key]) {
      return false;
    }
  }
  return true;
};

const getResult = (data, params) => {
  let $$ = data.$$;
  if (!$$) {
    return data;
  }

  for (const cond of $$.matches) {
    if (isMatch(cond.match, params)) {
      return cond.result;
    }
  }

  return $$.default || data;
};

app.all("/api*", (req, res) => {
  const verb = req.method.toLowerCase();
  const path = req.path
    .split("/")
    .filter(s => s.trim())
    .splice(1)
    .join("/");

  res.contentType("application/json");

  getJson(path, verb)
    .then(json => {
      const params = Object.assign({}, req.body, req.query);
      const result = getResult(json, params);
      res.send(result);
    })
    .catch(err => {
      res.status(404);
      res.send(err);
    });
});

app.listen(options.port, () =>
  console.log(
    `listening on port: ${options.port}\nbase directory: ${options.baseDir}`
  )
);
