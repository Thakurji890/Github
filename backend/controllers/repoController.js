// instead of mongoose we can also use mongodb
// that are used on user controller
const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const creatRepository = async (req, res) => {
  const { owner, name, issues, content, description, visiblity } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository Name is Required!" });
    }

    if (!owner) {
      return res.status(400).json({ error: "Owner Id is Required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visiblity,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res
      .status(201)
      .json({ message: "Repository Created", repositoryId: result._id });
  } catch (error) {
    console.error(`Uanble to create Repository ${error}`);
    res.status(500).send("Server Error");
  }
};

const getAllRepository = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.send(repositories);
  } catch (error) {
    console.error(`Uable to fetching Repositories due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const { id: repoId } = req.params;
  try {
    const repository = await Repository.find({ _id: repoId })
      .populate("owner")
      .populate("issues");
    if (!repository) {
      return res.status(404).json({ message: "Repository Not Found!" });
    }
    res.json(repository);
  } catch (error) {
    console.error(`Uable to fetching Repository due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name: repoName } = req.params;
  try {
    const repository = await Repository.find({ name: repoName })
      .populate("owner")
      .populate("issues");
    if (!repository) {
      return res.status(404).json({ message: "Repository Not Found!" });
    }
    res.json(repository);
  } catch (error) {
    console.error(`Uable to fetching Repository due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const fectchRepositoryForCurrentUser = async (req, res) => {
  res.send("repositories for logged in user fectched");
};

const updateRepositoryById = async (req, res) => {
  res.send("Repository Updated");
};

const toggleVisibilityById = async (req, res) => {
  res.send("Visibility Toggled!");
};

const deleteRepositoryById = async (req, res) => {
  res.send("Repository Deleted!");
};

module.exports = {
  creatRepository,
  getAllRepository,
  fetchRepositoryById,
  fetchRepositoryByName,
  fectchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
