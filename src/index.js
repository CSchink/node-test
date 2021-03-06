const connection = require("./connection.js");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const secretKey = "Johnny Be Good";




app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Express Router:
// const router = express.Router();
// router.get()
// app.use(router);

app.post("/login", async function (req, res, next) {
  let client = await connection.connect();
  let confirmation = await connection.userCheck(
    client,
    req.body.username,
    req.body.password
  );
  // res.sendStatus(200)
  if (confirmation) {
    const token = jwt.sign("Hello world", secretKey);
    console.log(token);
    res.json(token);
  } else {
    res.sendStatus(400);
  }
});



app.use((req, res, next) => {
  console.log("middleware");
  // verify token

  let token = req.headers.authorization;
  console.log(token);

  try {
    let verify = jwt.verify(token, secretKey);

    console.log(verify);

    // if verifying token succeeds continue
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(401);

    // res.status(500).json("We caught this error");
  }

  // if verifying token throws error, return 401

  // if (req.headers.authorization) {

  // }

  // console.log(req.path);

  // if (req.path === "/") {
  //     next();
  // } else {
  //     //401: Unauthorized
  //     res.sendStatus(401);
  // }

  // next();
});



app.post("/getaccount", async function (req, res) {
  let client = await connection.connect();
  let data = await connection.getAccount(client, req.body);
  console.log(req.body);
  res.json(data);
  console.log(data);
});

app.post("/articleentry", async function (req, res){
  let client = await connection.connect()
  let data = await connection.createOutline(client, req.body)
  res.json(data)
})

app.post("/listoutlines", async function (req, res){
  let client = await connection.connect()
  let data = await connection.listOutlines(client, req.body)
  res.json(data)
})

app.get("/", function (req, res) {
  console.log("route handler");
  res.send("Hello John!!");
});

app.get("/listDatabases", async function (req, res) {
  let client = await connection.connect();
  let databases = await connection.listDatabases(client);
  res.json(databases);
});

app.get("/listEntries", async function (req, res) {
  let client = await connection.connect();
  let entries = await connection.listEntries(client);
  res.json(entries);
});

app.get("/listScienceEntries", async function (req, res) {
  let client = await connection.connect();
  let entries = await connection.listScienceEntries(client);
  res.json(entries);
});

app.get("/deleteEntries", async function (req, res) {
  let client = await connection.connect();
  let update = await connection.deleteEntries(client, "John");
  res.json(update);
});

app.post("/createEntry", async function (req, res) {
  let client = await connection.connect();
  let newEntry = await connection.createEntry(client, req.body); 
  res.json(newEntry)
  //   .then(result =>{
  //       console.log(result)
  //   })
  //   console.log(req.body)
  //   let newEntry = await connection.createEntry(client, {
  //     Date: req.body.date,
  //     Entry: req.body.entry,
  //     Century: req.body.century,
  //     Category: req.body.category,
  //     Originating: req.body.origin,
  //     Target: req.body.target,
  //     Cultural: [req.body.ctags],
  //     ptags: [req.body.ptags],
  //     htags: [req.body.tags],
  //     Source: req.body.source,
  //     Page: req.body.page,
  //   });
  //   res.json(newEntry);
});

app.post("/createScienceEntry", async function (req, res) {
  let client = await connection.connect();
  let newEntry = await connection.createScienceEntry(client, req.body);
  res.json(newEntry);
});

app.post("/listOutlines", async function (req, res) {
  console.log(req.body);
  let client = await connection.connect();
  let getOutlines = await connection.listOutlines(client, req.body);
  res.json(getOutlines)
});

app.post("/editData", async function (req, res) {

  let client = await connection.connect();
  let findOne = await connection.editData(client, req.body);
  res.json(findOne)
});

app.put("/editScienceData", async function (req, res) {
  console.log(req.body);
  let client = await connection.connect();
  let findOne = await connection.editScienceData(client, req.body);

  res.json(findOne);
});

app.post("/signup", async function (req, res) {
  let client = await connection.connect();
  let newUser = await connection.newUser(client, req.body);
  res.json(newUser);
});

app.post("/newnotifications", async function (req, res) {
  let client = await connection.connect();
  let newUser = await connection.newNotifications(client, req.body);
  res.json(newUser);
});

app.post("/getnotifications", async function (req, res) {
  let client = await connection.connect();
  let getnotifications = await connection.getNotifications(client, req.body);
  res.json(getnotifications);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app is now listening on port 3000");
});

