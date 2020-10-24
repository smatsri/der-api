const fs = require("fs-extra");
const fsPath = require("path");
const config = require("./config")

const getAvailablePaths = (path, verb) => {
  let paths = [`${path}.${verb}.json`, `${path}/${verb}.json`];

  if (verb === "get") {
    paths = paths.concat([`${path}.json`, `${path}/index.json`]);
  } else if (verb === "post") {
  }

  paths = paths.map(p => fsPath.join(config.baseDir, p));

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
    return { json, statusCode: 200 };
  }

  throw { message: "json not found" };
};

const isMatch = (a, b) => {
  for (const key of Object.keys(a)) {
    // eslint-disable-next-line eqeqeq
    if (a[key] != b[key]) {
      return false;
    }
  }
  return true;
};

const getData = (data, params) => {
  let $$ = data.$$;
  if (!$$) {
    return { data, statusCode: 200 };
  }

  for (const cond of $$.matches) {
    if (isMatch(cond.match, params)) {
      return {
        data: cond.data,
        statusCode: cond.statusCode
      };
    }
  }

  if ($$.default) {
    return {
      data: $$.default.data,
      statusCode: $$.default.statusCode
    }
  }
  return $$.default || { data, statusCode: 200 };
};

exports.handler = (req, res) => {
  const verb = req.method.toLowerCase();
  const path = req.baseUrl
    .split("/")
    .filter(s => s.trim())
    .splice(1)
    .join("/");

  res.contentType("application/json");

  getJson(path, verb)
    .then(({ json, statusCode }) => {
      const params = Object.assign({}, req.body, req.query);
      const result = getData(json, params);
      res.status(result.statusCode);
      res.send(result.data);
    })
    .catch(err => {
      res.status(404);
      res.send(err);
    });
}

