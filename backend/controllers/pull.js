const fs = require("fs").promises;
const path = require("path");
const {
  s3,
  S3_BUCKET,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".fileGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    });
    const data = await s3.send(command);

    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;
      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop(),
      );
      await fs.mkdir(commitDir, { recursive: true });
      const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
      const fileContent = await s3.send(getCommand);
      await fs.writeFile(path.join(repoPath, key), fileContent.Body);

      console.log(`All commit pulled from S3`);
    }
  } catch (err) {
    console.error(`Unable fetch the pull requrest ${err}`);
  }
}
module.exports = { pullRepo };
