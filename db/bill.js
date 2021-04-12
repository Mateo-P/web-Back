import MongoDb from "mongodb";
import {updateOrders} from "./order.js"
var { ObjectID } = MongoDb;
export async function createBill(db, {tip, paymentMethod,total, orders }) {
    await updateOrders(db, orders.map(({_id})=> _id))
    let taxes=0.08;
    let createdTime = Date.now();
    let _id = new ObjectID();
    let subTotal= total/(1+taxes);
    let bill = {
      _id,
      restaurant:orders[0].restaurant,
      createdTime,
      state:"CREATED",
      orders,
      tax:subTotal*taxes  ,
      subTotal,
      tip,
      paymentMethod,
      total
    };
    const result = await db
      .collection("bills")
      .insertOne(bill)
      .then((res) => {
        return res.ops[0];
      });
  
    return result;
  }

  export async function getBillsByRestaurant(db, {states,restaurant}) {
    const results = await db
      .collection("bills")
      .find({
        restaurant,
        state: { $in: states },
      })
      .sort({ createdTime: -1 })
      .toArray();
  
    return results;
  }
  export async function updateBill(db, { _id, state }) {
    const now = Date.now();
    const result = await db
      .collection("bills")
      .findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $set: { state, ["confirmedTime"]: now } },
        { returnOriginal: false }
      );
    
    return result.value;
  }