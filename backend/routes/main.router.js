const express = require("express");
const mainRouter = express.Router();

const userRouter = require("../routes/user.router");

const repoRouter = require("../routes/repo.router");

mainRouter.use(userRouter);
mainRouter.use(repoRouter);

mainRouter.get("/", (req, res) => {
  res.json({ Status: "Good" });
});

module.exports = mainRouter;
