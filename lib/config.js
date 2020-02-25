const yargs = require("yargs")
const config = yargs
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
  .help();

exports.port = config.argv.port
exports.baseDir = config.argv.baseDir