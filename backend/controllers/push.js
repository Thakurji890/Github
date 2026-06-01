const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET, PutObjectCommand } = require("../config/aws-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".fileGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        });

        await s3.send(command);
      }
    }
    console.log("All commit pushed to S3");
  } catch (error) {
    console.error(`Error during pushing to S3 : ${error}`);
  }
}
module.exports = { pushRepo };
