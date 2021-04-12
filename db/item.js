import MongoDb from "mongodb";
var { ObjectID } = MongoDb;
import { uploadToS3 } from "../lib/uploadToS3.js";
import { getRestaurants } from "./restaurant.js";
export async function createItem(
  db,
  { owner, name, description, price, category, options, image }
) {
  let restaurants = await getRestaurants(db, { owner });
  let availableRestaurants = restaurants.map((restaurant) => {
    return ObjectID(restaurant._id);
  });
  const item = {
    name,
    description,
    price,
    options,
    availableAt: availableRestaurants,
  };
  //create item
  item.category = ObjectID(category);

  if (image) {
    const fileInfo = await uploadToS3(image);
    item.image = fileInfo;
  }

  const result = await db.collection("items").insertOne(item);

  return result.ops[0];
}

export async function findItem(db, _id) {
  const result = await db
    .collection("items")
    .findOne({ _id: ObjectID(_id) })
    .then((res) => {
      return res;
    });

  return result;
}
export async function updateitem(db, { _id, ...item }) {
  if (item.image) {
    const fileInfo = await uploadToS3(item.image);

    item.image = fileInfo;
  }

  const result = await db
    .collection("items")
    .findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: item },
      { returnOriginal: false }
    );

  return result.value;
}

export async function deleteItem(db, { _id }) {
  const result = await db
    .collection("items")
    .findOneAndDelete({ _id: ObjectID(_id) }, { returnOriginal: false });
  return result.value;
}

export async function getItems(db, params) {
  if (params.category) {
    params.category = ObjectID(params.category);
  }

  if (params.restaurantId) {
    params.availableAt = { $in: [ObjectID(params.restaurantId)] };
    params.restaurantId = null;
  }

  const results = await db.collection("items").find(params).toArray();

  return results;
}

export async function addRestaurantAvailabityToItem(db, { _id, restaurantId }) {
  const result = await db
    .collection("items")
    .findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $addToSet: { availableAt: ObjectID(restaurantId) } },
      { returnOriginal: false }
    );

  return result.value;
}

export async function removeRestaurantAvailabityToItem(
  db,
  { _id, restaurantId }
) {
  const result = await db
    .collection("items")
    .findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $pull: { availableAt: ObjectID(restaurantId) } },
      { returnOriginal: false }
    );

  return result.value;
}
