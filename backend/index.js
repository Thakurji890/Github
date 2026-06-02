require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");

// socket creation
const { Server } = require("socket.io");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
  .command("start", "start a new server", {}, startServer)
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
  .command("pull", "pull commit from repo", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    },
  )
  .demandCommand(1, "You have to give atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 5500;

  app.use(bodyParser.json());
  app.use(express.json());
  // cors use
  app.use(cors({ origin: "*" }));

  const mongoURI = process.env.MONGO_URI;

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log(`Database Connected Successfully ✅ 🚀`);
    })
    .catch((error) => {
      console.error(`Unable to Connect With Database Due to ${error}`);
    });

  app.get("/", (req, res) => {
    res.json({ Status: "Good" });
  });

  let user = "aniket";
  // server creation
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("======");
      console.log(user);
      console.log("======");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("CRUD Operation is Called");
    // CRUD Operation
  });

  httpServer.listen(port, () => {
    console.log(`Server is Running on PORT : ${port}`);
  });
}
