//var ObjectID = require("mongodb").ObjectID;
import MongoDb from "mongodb";
var { ObjectID } = MongoDb;

export async function createRestaurant(db, { name, address, owner,phone }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):

  const restaurant = {
    name,
    address,
    owner,
    phone
  };

  restaurant.categories = [];
  restaurant.tables = [];

  const result = await db
    .collection("restaurants")
    .insertOne(restaurant)
    .then((res) => {
      return res.ops[0];
    });

  return result;
}

const sortTables = (restaurant) => {
  restaurant.tables.sort(function (a, b) {
    let keyA = a.number;
    let keyB = b.number;

    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
};

export async function findRestaurant(db, _id) {
  const result = await db
    .collection("restaurants")
    .findOne({ _id: ObjectID(_id) });

  return result;
}
export async function updateRestaurant(db, { _id, ...restaurant }) {
  const result = await db
    .collection("restaurants")
    .findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: restaurant },
      { returnOriginal: false }
    );
  return result.value;
}

export async function deleteRestaurant(db, { _id }) {
  const result = await db
    .collection("restaurants")
    .findOneAndDelete({ _id: ObjectID(_id) }, { returnOriginal: false });
  return result.value;
}
export async function getRestaurants(db, owner) {
  const results = await db
    .collection("restaurants")
    .find(owner?owner:{} )
    .toArray();

  //SORT WITH MONGODB DRIVER
  results.forEach((restaurant) => {
    sortTables(restaurant);
  });

  return results;
}
