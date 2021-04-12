//const { extname } = require('path');
//const { v4: uuid } = require('uuid'); // (A)
//const s3 = require('./s3'); // (B)

import path from "path";
import { v4 as uuid } from "uuid";
import s3 from "./s3.js";

var { extname } = path;
//var { v4: uuid } = uuidExport;

export const uploadToS3 = async (file) => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  let uploadParams = {
    Bucket: "mi-menu",
    Body: createReadStream(),
    Key: `${uuid()}${extname(filename)}`,
    ContentType: mimetype,
  };

  const { Location } = await s3.upload(uploadParams).promise();

  return {
    filename,
    mimetype,
    encoding,
    uri: Location, // (D)
  };
};
