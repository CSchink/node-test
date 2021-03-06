var Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1063466",
  key: "e01d32568ef94bcc8f8f",
  secret: "2e55a4e860c2e4314946",
  cluster: "us2",
  encrypted: true,
});

async function connect() {
  const uri =
    "mongodb+srv://dbCorey:MVDhmYhNQkp2y8T@cluster0-ymebw.mongodb.net/sottlab?retryWrites=true&w=majority";

  const { MongoClient } = require("mongodb");
  const client = new MongoClient(uri);
  return await client.connect();
}

const { response } = require("express");

// async function main(){
//     const uri="mongodb+srv://dbCorey:MVDhmYhNQkp2y8T@cluster0-ymebw.mongodb.net/sottlab?retryWrites=true&w=majority"
//     const {MongoClient} = require('mongodb');
//     const client = new MongoClient(uri);

//     try {
//     await client.connect();

//     await listDatabases(client);
//     await createListing(client,
//         {
//            user: "New sample",
//            password:"J54fn"
//         }
//     );

// } catch (e) {
//     console.error(e);
// }
// finally {
//     await client.close();
// }
// }
// main().catch(console.error);

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  return databasesList.databases;
}

async function listEntries(client) {
  const cursor = await client.db("sottlab").collection("historylab2").find({});
  let results = await cursor.toArray();
  results.forEach((result) => {
    Object.keys(result).forEach((key) => {
      if (typeof result[key] === "string") {
        result[key] = result[key].trim();
      } else if (Array.isArray(result[key])) {
        result[key] = result[key]
          .filter((value) => value != null)
          .map((value) => value.trim());
      }
    });
  });

  return results;
}

async function userCheck(client, username, password) {
  const cursor = await client.db("sottlab").collection("logindata").find({});
  let results = await cursor.toArray();
  let confirmation = results.some(function (result) {
    if (result.user === username && result.password === password) {
      return true;
    } else {
      return false;
    }
  });
  return confirmation;
}

async function getAccount(client, entry) {
  const query = { user: entry.user, password: entry.password };
  const results = await client
    .db("sottlab")
    .collection("logindata")
    .findOne(query);
  console.log(results);
  return results;
  // return {
  //       user: "John",
  //       image: "http://wallpaperose.com/wp-content/uploads/2014/02/Lighthouse-Shining-over-Rough-Seas.jpg"
  //   }
}

async function deleteEntries(client, userName) {
  result = await client
    .db("sottlab")
    .collection("logindata")
    .deleteOne({ user: userName });
  console.log(`${result.deletedCount} document(s) were deleted.`);
}

async function createEntry(client, newEntry) {
  pusher.trigger("historylab", "historyinsert", {
    message: newEntry.Entry,
  });
  const result = await client
    .db("sottlab")
    .collection("historylab2")
    .insertOne(newEntry);
  console.log(`New entry created with the following id: ${result.insertedId}`);
  return result;
}

async function createOutline(client, newEntry) {
  const result = await client
    .db("sottlab")
    .collection("articles")
    .insertOne(newEntry);
  console.log(`New entry created with the following id: ${result.insertedId}`);
  return result;
}

async function listOutlines(client, entry) {
  const cursor = await client
    .db("sottlab")
    .collection("articles")
    .find({ user: entry.user });
  let results = await cursor.toArray();
  console.log(results)
  console.log(entry)
  return results;
}

async function createScienceEntry(client, newEntry) {
  const result = await client
    .db("sottlab")
    .collection("sciencelab")
    .insertOne(newEntry);
  console.log(`New entry created with the following id: ${result.insertedId}`);
  return result;
}

async function newUser(client, user) {
  const result = await client
    .db("sottlab")
    .collection("logindata")
    .insertOne(user);
  return result;
}

async function editData(client, entry) {
  console.log(entry);
  const ObjectID = require("mongodb").ObjectID;
  let id = new ObjectID(entry._id);
  let query = { _id: id };

  let update = {
    Date: entry.Date,
    Entry: entry.Entry,
    Century: entry.Century,
    Category: entry.Category,
    Originating: entry.Origin,
    Target: entry.Target,
    Cultural: entry.Cultural,
    ptags: entry.ptags,
    htags: entry.htags,
    Source: entry.Source,
    Page: entry.Page,
  };
  await client
    .db("sottlab")
    .collection("historylab2")
    .replaceOne(query, update);
}

async function editScienceData(client, entry) {
  console.log(entry);
  const ObjectID = require("mongodb").ObjectID;
  let id = new ObjectID(entry._id);
  let query = { _id: id };

  let update = {
    Date: entry.Date,
    Entry: entry.Entry,
    Field: entry.Field,
    Subfields: entry.Subfields,
    Tags: entry.Tags,
    Source: entry.Source,
    Page: entry.Page,
  };
  await client.db("sottlab").collection("sciencelab").replaceOne(query, update);
}

async function listScienceEntries(client) {
  const cursor = await client.db("sottlab").collection("sciencelab").find({});
  let results = await cursor.toArray();
  return results;
}

async function newNotifications(client, entry) {
  const result = await client
    .db("sottlab")
    .collection("notifications")
    .insertOne(entry);
  console.log(`New entry created with the following id: ${result.insertedId}`);
  return result;
}

async function getNotifications(client, entry) {
  console.log(entry.User);
  let query = {
    User: { $ne: entry.User },
    // Date: {
    //   $lt: new Date(),
    //   $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
    // },
  };
  const cursor = await client
    .db("sottlab")
    .collection("notifications")
    .find(query);
  // console.log(results);
  let results = await cursor.toArray();
  return results;
}

module.exports = {
  newNotifications,
  getNotifications,
  getAccount,
  createOutline,
  listScienceEntries,
  userCheck,
  editScienceData,
  createScienceEntry,
  newUser,
  listDatabases,
  connect,
  listEntries,
  deleteEntries,
  createEntry,
  editData,
  listOutlines,
};
