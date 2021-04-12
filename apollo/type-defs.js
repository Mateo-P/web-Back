import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    createdAt: String!
    restaurants: [Restaurant]
    categories: [Category]
    image: File
  }

  type Restaurant {
    _id: ID!
    owner: User
    name: String!
    address: String
    phone:String
    tables: [Table]
    categories: [Category]
  }

  type Category {
    _id: ID!
    name: String!
    items: [Item]
  }

  type Table {
    _id: ID!
    name: String
    top: Int!
    left: Int!
  }

  type File {
    uri: String
    filename: String
    mimetype: String
    encoding: String
  }

  type Item {
    _id: ID!
    name: String!
    description: String
    price: Float!
    image: File
    availableAt: [ID]
    category: ID
    options: [ItemOption]
  }
  type ItemOption {
    name: String!
    min: Int
    max: Int
    entries: [Entrie]
  }
  type Entrie {
    name: String!
    price: Float
  }
  enum OrderState {
    CREATED
    PROGRESS
    FINISHED
    DECLINED
    BILLED
    PAID
  }
  enum PaymentMethod {
    CARD
    CASH
  }

  type Order {
    _id: ID!
    quantity: Int!
    comments: String
    createdTime: String!
    confirmedTime: String
    finishedTime: String
    state: OrderState!
    restaurant: ID!
    table: Table
    line: Boolean
    image: String
    item: Item!
    clientName: String
    clientPhone:String
  }
  
  type Bill {
    _id:ID!
    restaurant:ID!
    createdTime:String!
    finishedTime: String
    state: OrderState!
    orders:[Order]
    tax:Float!
    subTotal:Float
    tip:Int
    paymentMethod:PaymentMethod
    total:Int!
  }

  input OrdesByRestaurantInput {
    states:[String]
    restaurant:ID!
  }
  input HistoryInput {
    date1: String
    date2: String
    restaurant: ID!
  }
  input OrderedItemInput {
    _id: ID!
    name: String!
    price: Float!
    options: [ItemOptionInput]
  }

  input OrderInput {
    comments: String
    restaurant: ID!
    tableId: String
    quantity: Int!
    image: String
    item: OrderedItemInput!
    clientName: String
    clientPhone:String
  }

  input TableBillInput {
    _id: ID!
    name: String
  }
  input ItemBillInput {
    name: String!
    price: Float!
    }

  input OrderBillInput {
    _id: ID!
    quantity: Int!
    createdTime: String!
    confirmedTime: String
    finishedTime: String
    state: OrderState!
    restaurant: ID!
    item: ItemBillInput!
    clientName: String
    clientPhone:String
    table:TableBillInput
  }
  input BillInput {
    tip:Int
    paymentMethod:PaymentMethod
    total:Int!
    orders:[OrderBillInput]!
  }

  input OrdersByClientInput {
    _id: ID!
  }
  input SignUpInput {
    email: String!
  }

  input RestaurantInput {
    name: String!
    address: String
    phone:String
    owner: String!
  }

  input CategoryInput {
    name: String!
    user: String!
  }
  input EditCategoryInput {
    _id: ID!
    name: String!
  }
  input DeleteCategoryInput {
    _id: ID!
  }
  input TableInput {
    name: String!
    top: Int!
    left: Int!
    restaurant: ID!
  }
  input UpdateRestaurantInput {
    _id: ID!
    name: String
    address: String
    phone:String
  }
  input DeleteRestaurantInput {
    _id: ID!
  }
  input UpdateItemInput {
    _id: ID!
    name: String
    description: String
    price: Float
    category: ID
    image: Upload
    options: [ItemOptionInput]
  }
  input DeleteItemInput {
    _id: ID!
  }
  input UpdateOrderInput {
    _id: ID!
    state: String!
  }

  input DeleteOrderInput {
    _id: ID!
  }
  input UpdateBillInput {
    tip:Int!
    paymentMethod:PaymentMethod!
    _id: ID!
    state: String!
  }
  input UpdateTableInput {
    _id: ID!
    name: String
    top: Int
    left: Int
  }
  input DeleteTableInput {
    _id: ID!
    restaurant: ID!
  }
  input FindTableInput {
    _id: ID!
  }
  input FindItemInput {
    _id: ID!
  }
  input ItemInput {
    owner: String!
    name: String!
    description: String!
    price: Float!
    category: ID!
    image: Upload
    options: [ItemOptionInput]
  }
  input ItemOptionInput {
    name: String!
    entries: [OptionEntrieInput]
    min: Int
    max: Int
  }
  input OptionEntrieInput {
    name: String!
    price: Float
  }
  input UserImageInput {
    email: String!
    image: Upload!
  }
  input UpdateItemAvailabilityInput {
    _id: ID!
    restaurantId: ID!
  }

  input ChangeCategoryOrderInput {
    _id: ID!
    position: Int!
  }

  type SignUpPayload {
    user: User!
  }

  type RestaurantPayload {
    restaurant: Restaurant!
  }

  type CategoryPayload {
    category: Category!
  }

  type ItemPayload {
    item: Item!
  }

  type TablePayload {
    table: Table!
  }
  type TablesPayload {
    tables: [Table]!
  }
  type OrderPayload {
    order: Order!
  }
  type OrdersPayload {
    orders: [Order]!
  }
  type BillPayload {
    bill:Bill!
  }
  type UserPayload {
    user: User!
  }

  type ChangeCategoryPayload {
    categories: [Category]!
  }

  type Query {
    user(email: String!): User
    users: [User]

    restaurant(id: ID!): Restaurant!
    restaurants: [Restaurant]
    restaurantsByOwner(owner: String!): [Restaurant]

    ordersByRestaurant(input:OrdesByRestaurantInput!): [Order]!
    ordersByClient(input: [OrdersByClientInput]!): [Order]!

    billsByRestaurant(input:OrdesByRestaurantInput!): [Bill]!
    historyByRestaurant(input: HistoryInput!): [Order]!

    findTable(input: FindTableInput!): TablePayload!
    findItem(input: FindItemInput!): ItemPayload!
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!

    addCategory(input: CategoryInput!): CategoryPayload!
    editCategory(input: EditCategoryInput!): CategoryPayload!
    deleteCategory(input: DeleteCategoryInput!): CategoryPayload!
    changeCategoryOrder(input: ChangeCategoryOrderInput): ChangeCategoryPayload!

    addRestaurant(input: RestaurantInput!): RestaurantPayload!
    updateRestaurant(input: UpdateRestaurantInput!): RestaurantPayload!
    deleteRestaurant(input: DeleteRestaurantInput!): RestaurantPayload!

    addTable(input: TableInput!): TablePayload!
    updateTable(input: UpdateTableInput!): TablePayload!
    deleteTable(input: DeleteTableInput!): TablesPayload!

    addItem(input: ItemInput!): ItemPayload!
    updateItem(input: UpdateItemInput): ItemPayload!
    addRestaurantAvailabityToItem(
      input: UpdateItemAvailabilityInput
    ): ItemPayload!
    removeRestaurantAvailabityToItem(
      input: UpdateItemAvailabilityInput
    ): ItemPayload!
    deleteItem(input: DeleteItemInput!): ItemPayload!

    addOrders(input: [OrderInput]!): OrdersPayload!
    deleteOrder(input: DeleteOrderInput!): OrderPayload!
    updateOrder(input: UpdateOrderInput): OrderPayload!

    createBill(input:BillInput!): BillPayload!
    updateBill(input: UpdateBillInput):BillPayload!
    addUserImage(input: UserImageInput!): UserPayload!
  }
`;
