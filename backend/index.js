// require("dotenv").config();

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
  .command("init", "Intialization of new Repostiory", {}, initRepo)
  .command(
    "add <file>",
    "Added files to the Repostiory",
    (yargs) => {
      {
        yargs.positional("file", {
          describe: "File added to staging area",
          type: "string",
        });
      }
    },
    (argv) => {
      addRepo(argv.file);
    },
  )
  .command(
    "commit <message>",
    "commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command("push", "push Commit to repo", {}, pushRepo)
  .command("pull", "pull Commit from repo",{}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    revertRepo,
  )
  .demandCommand(1, "You have give atleast one command")
  .help().argv;
