import MongoDb from "mongodb";
var { ObjectID } = MongoDb;

export async function createCategory(db, { name, user }) {
  const _id = new ObjectID();
  const category = {
    name,
    _id,
  };
  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { email: user },
      { $push: { categories: category } },
      { returnOriginal: false }
    )
    .then((res) => {
      return res.value.categories.slice(-1)[0];
    });

  return result;
}

export async function deleteCategory(db, { _id }) {
  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { categories: { $elemMatch: { _id: ObjectID(_id) } } },
      { $pull: { categories: { _id: ObjectID(_id) } } }
    );

  const deletedCategory = result.value.categories.find(
    (cat) => cat._id.toString() === _id
  );

  return deletedCategory;
}
export async function editCategory(db, { _id, name }) {
  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { categories: { $elemMatch: { _id: ObjectID(_id) } } },
      { $set: { "categories.$.name": name } },
      { returnOriginal: false }
    );

  const editedCategory = result.value.categories.find(
    (cat) => cat._id.toString() === _id
  );

  return editedCategory;
}

function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
}

export async function changeCategoryOrder(db, { _id, position }) {
  const searchResult = await db
    .collection("users")
    .findOne({ categories: { $elemMatch: { _id: ObjectID(_id) } } });

  let categoriesArray = searchResult.categories;

  const currentPosition = categoriesArray.findIndex(
    (cat) => cat._id.toString() === _id
  );
  const newArray = arrayMove(categoriesArray, currentPosition, position);

  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { categories: { $elemMatch: { _id: ObjectID(_id) } } },
      { $set: { categories: newArray } },
      { returnOriginal: false }
    );

  return result.value.categories;
}
