const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "ap-south-1" });
const S3_BUCKET = "github-buckets3";

module.exports = {
  s3,
  S3_BUCKET,
};
