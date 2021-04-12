import MongoDb from "mongodb";
var { ObjectID } = MongoDb;

async function sameTableNameInRestaurantException(db, restaurantId, name) {
  const sameTable = await db
    .collection("restaurants")
    .findOne({ _id: ObjectID(restaurantId), "tables.name": name });

  if (sameTable) {
    throw "Table with the same name exists in the restaurant";
  }
}

export async function createTable(db, { name, top, left, restaurant }) {
  await sameTableNameInRestaurantException(db, restaurant, name);

  const _id = new ObjectID();

  const table = {
    name,
    top,
    left,
    _id,
  };

  const result = await db
    .collection("restaurants")
    .findOneAndUpdate(
      { _id: ObjectID(restaurant) },
      { $push: { tables: table } },
      { returnOriginal: false }
    )
    .then((res) => {
      return res.value.tables.slice(-1)[0];
    });

  return result;
}
export async function deleteTable(db, { _id, restaurant }) {
  const result = await db
    .collection("restaurants")
    .findOneAndUpdate(
      { _id: ObjectID(restaurant) },
      { $pull: { tables: { _id: ObjectID(_id) } } },
      { returnOriginal: false }
    );

  return result.value.tables;
}
export async function updateTable(db, { _id, name, top, left }) {
  const tableId = new ObjectID(_id);

  let modifyObject = {};

  if (name) {
    modifyObject["tables.$.name"] = name;
  }
  if (top) {
    modifyObject["tables.$.top"] = top;
  }
  if (left) {
    modifyObject["tables.$.left"] = left;
  }

  const result = await db
    .collection("restaurants")
    .findOneAndUpdate(
      { tables: { $elemMatch: { _id: tableId } } },
      { $set: modifyObject },
      { returnOriginal: false }
    );

  return result.value.tables.find((table) => table._id.toString() === _id);
}

export async function findTable(db, { _id }) {
  const tableId = new ObjectID(_id);
  const result = await db
    .collection("restaurants")
    .findOne({ tables: { $elemMatch: { _id: tableId } } });
  const table = result.tables.find((table) => table._id.toString() === _id);
  return table;
}
