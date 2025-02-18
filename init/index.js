const path = require("path");
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const DB_URL = process.env.DB_URL;

main()
  .then(() => {
    console.log(`connected with db `);
  })
  .catch((err) => {
    console.log(`${err} YOYO ${DB_URL}`);
  });

async function main() {
  await mongoose.connect(DB_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
