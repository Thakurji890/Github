const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".fileGit"); // current working directory(cwd) -- hidden file
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    // recursive -- true becouse we can more file on that folder

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: "first bucket" }),
    );
    console.log("Repository Initialized!");
  } catch (err) {
    console.error("Error During initialising repository", err);
  }
}
module.exports = { initRepo };
