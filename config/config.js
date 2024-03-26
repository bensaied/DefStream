const dotenv = require("dotenv");
dotenv.config();
const config = {
  hostname: "localhost",
  PORT_HTTPS: parseInt(process.env.port_https),
  PORT: parseInt(process.env.port),
  JWTSECRET: process.env.jwtSecret,
  mongoURI: "mongodb://localhost:27017/DefStream",
};
module.exports = config;
