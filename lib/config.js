const yargs = require("yargs")
const config = yargs
  .options({
    port: {
      type: "number",
      default: 3300,
      describe: "port to user"
    },
    baseDir: {
      type: "string",
      default: "./api",
      describe: "directory base"
    },
    origin: {
      type: "string",
      default: "*",
      describe: "origin",
    }
  })
  .help();

exports.port = config.argv.port
exports.baseDir = config.argv.baseDir
exports.origin = config.argv.origin