import MongoDb from "mongodb";
var { ObjectID } = MongoDb;
import { findTable } from "./table.js";

export async function createOrders(db, orders) {
  const now = Date.now();
  console.log(orders)
  let table;

  if (orders[0].tableId) {
    table = await findTable(db, { _id: orders[0].tableId });
  }

  orders.forEach((ord) => {
    delete ord["tableId"];
    ord.restaurant = ObjectID(ord.restaurant);
    ord.createdTime = now;
    ord.state = "CREATED";
    ord.item._id = ObjectID(ord.item._id);
    if (table) {
      ord.table = table;
    }
  });

  const result = await db.collection("orders").insertMany(orders);
  return result.ops;
}

export const deleteOrder = async (db, { _id }) => {
  const result = await db
    .collection("orders")
    .findOneAndDelete({ _id: ObjectID(_id) });
  return result.value;
};
export async function updateOrder(db, { _id, state }) {
  const now = Date.now();
  const time = state === "PROGRESS" ? "confirmedTime" : "finishedTime";
  const result = await db
    .collection("orders")
    .findOneAndUpdate(
      { _id: ObjectID(_id) },
      { $set: { state, [time]: now } },
      { returnOriginal: false }
    );

  return result.value;
}
export async function updateOrders(db,  ids ) {
  let objIds= ids.map((_id)=>ObjectID(_id))
  const result = await db
    .collection("orders")
    .updateMany(
      { _id: {$in: objIds }},
      { $set: { state:"BILLED" } },
      { returnOriginal: false }
    );
  return result.value;
}
export async function getOrdersByRestaurant(db, {states,restaurant}) {
  const results = await db
    .collection("orders")
    .find({
      restaurant: ObjectID(restaurant),
      state: { $in: states },
    })
    .sort({ createdTime: -1 })
    .toArray();

  return results;
}

export async function getOrdersByClient(db, orderIds) {
  let ids = orderIds.map(({ _id }) => ObjectID(_id));
  const results = await db
    .collection("orders")
    .find({
      _id: { $in: ids },
    })
    .sort({ createdTime: -1 })
    .toArray();

  return results;
}
export async function getHistoryByRestaurant(
  db,
  { date1 = "2020-01-01", date2, restaurant }
) {
  const lowInterval = Date.parse(date1);
  const highInterval = date2 ? Date.parse(date2) : Date.now();
  const results = await db
    .collection("orders")
    .find({
      restaurant: ObjectID(restaurant),
      state: { $in: ["BILLED"] },
      finishedTime: { $lte: highInterval, $gte: lowInterval },
    })
    .sort({ finishedTime: -1 })
    .toArray();

  return results;
}
