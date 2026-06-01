require("dotenv").config();

const {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
const S3_BUCKET = "github-buckets3";

module.exports = {
  s3,
  S3_BUCKET,
  PutObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
};
