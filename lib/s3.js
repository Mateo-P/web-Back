import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

//const config = require('../next.config');
const aws = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_VALUE,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
  region: process.env.AWS_S3_REGION,
  params: {
    ACL: "public-read",
    Bucket: process.env.AWS_S3_BUCKET,
  },
});
//module.exports = aws;

export default aws;
