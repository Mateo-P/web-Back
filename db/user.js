//var ObjectID = require('mongodb').ObjectID;
import { uploadToS3 } from "../lib/uploadToS3.js";
export async function createUser(db, { email }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):
  // const salt = crypto
  //   .randomBytes(16)
  //   .toString('hex')

  // const hash = crypto
  //   .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
  //   .toString('hex')

  const user = {
    createdAt: Date.now(),
    email,
    //hash,
    //salt,
  };

  //TODO: check if user already exists (email), call findUser method

  const result = await db
    .collection("users")
    .insertOne(user)
    .then((res) => {
      return res.ops[0];
    });

  return result;
}

export async function addUserImage(db, { email, image }) {
  let fileInfo = null;
  if (image) {
    fileInfo = await uploadToS3(image);
  }

  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { email },
      { $set: { image: fileInfo } },
      { returnOriginal: false }
    )
    .then((res) => {
      return res.value;
    });

  return result;
}
// Here you should lookup for the user in your DB
export async function findUser(db, user) {
  const result = await db
    .collection("users")
    .findOne(user)
    .then((res) => {
      return res;
    });

  return result;
}

export async function getUsers(db, user) {
  const result = await db
    .collection("users")
    .find(user ? user : {})
    .toArray()
    .then((res) => {
      return res;
    });

  return result;
}
