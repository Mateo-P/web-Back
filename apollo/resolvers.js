import { createUser, findUser, getUsers, addUserImage } from "../db/user.js";
import {
  createRestaurant,
  findRestaurant,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant,
} from "../db/restaurant.js";
import {
  createTable,
  updateTable,
  deleteTable,
  findTable,
} from "../db/table.js";
import {
  createCategory,
  deleteCategory,
  changeCategoryOrder,
  editCategory,
} from "../db/category.js";
import {
  findItem,
  createItem,
  getItems,
  updateitem,
  deleteItem,
  addRestaurantAvailabityToItem,
  removeRestaurantAvailabityToItem,
} from "../db/item.js";
import {
  createOrders,
  deleteOrder,
  getOrdersByRestaurant,
  updateOrder,
  getHistoryByRestaurant,
  getOrdersByClient,
} from "../db/order.js";
import {
  createBill,
  getBillsByRestaurant,
  updateBill
} from "../db/bill.js"
//import { publish } from '../lib/pusher';

export const resolvers = {
  Query: {
    async restaurant(_parent, { id }, { db }) {
      return await findRestaurant(db, id);
    },
    async restaurants(_parent, _args, { db }) {
      return await getRestaurants(db);
    },
    async restaurantsByOwner(_parent, params, { db }) {
      return await getRestaurants(db, params);
    },
    async user(_parent, { email }, { db }) {
      return await findUser(db, { email });
    },
    async users(_parent, _args, { db }) {
      return await getUsers(db);
    },
    async ordersByRestaurant(_parent, { input }, { db }) {
      return await getOrdersByRestaurant(db, input);
    },
    async billsByRestaurant(_parent, { input }, { db }) {
      return await getBillsByRestaurant(db, input);
    },
    async ordersByClient(_parent, { input }, { db }) {
      return await getOrdersByClient(db, input);
    },
    async historyByRestaurant(_parent, { input }, { db }) {
      return await getHistoryByRestaurant(db, input);
    },
    async findTable(_parent, { input }, { db }) {
      const table = await findTable(db, input);
      return { table };
    },
    async findItem(_parent, { input }, { db }) {
      const item = await findItem(db, input._id);
      return { item };
    },
  },
  Mutation: {
    async signUp(_parent, args, { db }) {
      const user = await createUser(db, args.input);
      return { user };
    },
    /**
     * Restaurant
     */
    async addRestaurant(_parent, { input }, { db }) {
      const restaurant = await createRestaurant(db, input);
      return { restaurant };
    },
    async updateRestaurant(_parent, { input }, { db }) {
      const restaurant = await updateRestaurant(db, input);
      return { restaurant };
    },
    async deleteRestaurant(_parent, { input }, { db }) {
      const restaurant = await deleteRestaurant(db, input);
      return { restaurant };
    },

    /**
     * Category
     */
    async addCategory(_parent, { input }, { db }) {
      const category = await createCategory(db, input);
      return { category };
    },
    async editCategory(_parent, { input }, { db }) {
      const category = await editCategory(db, input);
      return { category };
    },
    async deleteCategory(_parent, { input }, { db }) {
      const category = await deleteCategory(db, input);
      return { category };
    },
    async changeCategoryOrder(_parent, { input }, { db }) {
      const categories = await changeCategoryOrder(db, input);
      return { categories };
    },

    /*******************
     *      Item
     *******************/
    async addItem(_parent, { input }, { db }) {
      const item = await createItem(db, input);
      return { item };
    },
    async updateItem(_parent, { input }, { db }) {
      const item = await updateitem(db, input);
      return { item };
    },
    async deleteItem(_parent, { input }, { db }) {
      const item = await deleteItem(db, input);
      return { item };
    },

    /**
     * Table
     */
    async addTable(_parent, { input }, { db }) {
      const table = await createTable(db, input);
      return { table };
    },
    async updateTable(_parent, { input }, { db }) {
      const table = await updateTable(db, input);
      return { table };
    },
    async deleteTable(_parent, { input }, { db }) {
      const tables = await deleteTable(db, input);
      return { tables };
    },

    /********************
     *       Order
     ********************/
    async updateOrder(_parent, { input }, { db }) {
      const order = await updateOrder(db, input);
      return { order };
    },
    async deleteOrder(_parent, { input }, { db }) {
      const order = await deleteOrder(db, input);
      return { order };
    },
    async addOrders(_parent, { input }, { db }) {
      console.log(input)
      const orders = await createOrders(db, input);
      
      return { orders };
    },
    /******************
     *      Bill
     ******************/
    async createBill(_parent, { input }, { db }) {
  
      const bill = await createBill(db, input);
      return { bill };
    },
    async updateBill(_parent, { input }, { db }) {
      const bill = await updateBill(db, input);
      return { bill };
    },
    
    
    
    
     /**
     * Others
     */
    async addRestaurantAvailabityToItem(_parent, { input }, { db }) {
      const item = await addRestaurantAvailabityToItem(db, input);
      return { item };
    },
    async removeRestaurantAvailabityToItem(_parent, { input }, { db }) {
      const item = await removeRestaurantAvailabityToItem(db, input);
      return { item };
    },
    async addUserImage(_parent, { input }, { db }) {
      const user = await addUserImage(db, input);
      return { user };
    },
  },
  Restaurant: {
    async owner(restaurant, _, { db }) {
      const result = await findUser(db, { email: restaurant.owner });
      return result;
    },
    async categories(restaurant, _, { db }) {
      var categories;

      // TO-DO: remove categories from all restaurants in db so the "if" statement works correctly

      // if (restaurant.categories) {
      //     categories = restaurant.categories;
      // } else {
      const result = await findUser(db, { email: restaurant.owner });

      categories = result.categories;
      //}

      categories.map((cat) => {
        cat.restaurantId = restaurant._id;
        return cat;
      });

      return categories;
    },
  },
  User: {
    async restaurants(user, _, { db }) {
      const restaurants = await getRestaurants(db, { owner: user.email });
      restaurants.map((rest) => {
        rest.categories = user.categories;
      });

      return restaurants;
    },
  },
  Category: {
    async items({ _id, restaurantId }, _, { db }) {
      const result = await getItems(db, { category: _id, restaurantId });
      return result;
    },
  },
};
