const express = require("express"),
  pageRouter = require("./routes/user"),
  path = require("path"),
  fileUpload = require("express-fileupload"),
  app = express(),
  mysql = require("mysql2");

const controller = require("./controllers/user");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rohit123",
  database: "web",
});

connection.connect();

global.db = connection;

// all environments

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(fileUpload());

// development only

app.use("/", pageRouter);
app.get("/profile/:id", controller.getUserProfile);
//Middleware
app.listen(3000, () => console.log("Server started"));
