const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".fileGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));

    console.log(`file ${fileName} added to staging area!`);
  } catch (err) {
    console.error("Error on adding file", err);
  }
}

module.exports = { addRepo };
