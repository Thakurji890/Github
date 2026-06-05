const express = require("express");
const repoRouter = express.Router();

const repoController = require("../controllers/repoController");

repoRouter.post("/repo/create", repoController.creatRepository);
repoRouter.get("/repo/all", repoController.getAllRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get(
  "/repo/user/:userID",
  repoController.fectchRepositoryForCurrentUser,
);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);

module.exports = repoRouter;
