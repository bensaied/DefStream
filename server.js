// Import credentials values for instance launch
require("dotenv").config({ path: "./.env" });
// ExpressJS
const express = require("express");

// Initialize DB-Connection
const connectDB = require("./config/db");

// Middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection. (Prevention NoSQL Injextion)
const mongoSanitize = require("express-mongo-sanitize");

// Rate Limiter (A middleware for Express. Use to limit repeated requests to public APIs and/or endpoints.)
const rateLimit = require("express-rate-limit");

// SlowDown Express
//const SlowDown = require("express-slow-down");

// Prevent HTTP Parameter Pollution(HPP) attacks
const hpp = require("hpp");
// Prevent Cross-Site Scripting (XSS) attacks
const xss = require("xss-clean");
const helmet = require("helmet");
// Providing a Connect/Express middleware
const cors = require("cors");

const credentials = require("./config/credentials");

// Initialize express app
const app = express();

// Database Connection
connectDB();

// Backend-Port definition
const PORT = process.env.PORT || 5000;

// HTTP SERVER [
// Initialize http server (In the case of running in a localhost for development copy)
//const http = require("http");

// Define server and link it with our app
// const server = http.createServer(app);

// Define port listening
//server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// ]

////////////////////////////////////////////////////////
// HTTPS SERVER [
// After creating a SSL certificat we define the HTTPS server and we  link it with our app
//  fs(FileSystem) it makes APIs simple

const fs = require("fs");
const https = require("https");

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const server = https.createServer(options, app).listen(5000, function () {
  console.log("App listening on port 5000 (HTTPS)!");
});

//]

// Increase the maximum request size limit in uploading
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Socket.io definition
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Initialize & Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

//In order to view pdf files in chat

// Init Middleware : The app use JSON from the body that gets passed up to it inside of request
app.use(express.json({ extended: false }));

// Apply Rate limiter
const limiter = rateLimit({
  windowMs: 24 * 60 * 3, // next request to endpoint
  max: 100, // maximal request for all endpoint
  message: "To many request, send back request after 3 minutes",
});
app.use(limiter);
// Slow Down
// app.use(
//   SlowDown({
//     windowMs: 24 * 60 * 1, // next request to endpoint
//    // delayMs: 24 * 60 * 2000, // increment delay
//     delayAfter: 100 // slow down after request
//   })
// )

// Test server
app.get("/", (req, res) => res.send("API Running!"));
// Sanitize Data: protect against NoSQL injection
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// When it requests a resource that has a different origin (domain, protocol, or port)
app.set("trust proxy", 1);

// Prevent http param pollution
app.use(hpp());
// Enable CORS (if we will implement server and client in different domains)
app.use(
  cors({
    origins: "*:*",
  })
);
// Allow to access to the address
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Initialize Routes

app.use("/api/users", require("./routes/api/users"));
app.use("/api/missions", require("./routes/api/missions"));
app.use("/api/chats", require("./routes/api/chats"));

const chat = require("./utils/ChatWebSocket")(io);
const video = require("./utils/VideoStreamWebSocket")(io);

module.exports = server;
