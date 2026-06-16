// instead of mongoose we can also use mongodb
// that are used on user controller
const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const creatRepository = async (req, res) => {
  const { owner, name, issues, content, description, visibility } = req.body;

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
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    // Link the new repository back to the owner's repositories array
    await User.findByIdAndUpdate(owner, { $push: { repositories: result._id } });

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
  const userId = req.params.userID; // read from route param: /repo/user/:userID
  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required!" });
    }
    const repositories = await Repository.find({ owner: userId }).populate("owner").populate("issues");

    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ error: "User Repository Not Found!" });
    }
    res.json({ message: "Repositories Found!", repositories });
  } catch (error) {
    console.error(`Unable to fetch Repository due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "User Repository Not Found!" });
    }

    repository.content.push(content);
    repository.description = description;
    const updatedRepository = await repository.save();

    res.json({
      message: "Repository Updated Successfully!",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error(`Uable to Updating Repository due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "User Repository Not Found!" });
    }

    repository.visibility = !repository.visibility;
    const updatedRepository = await repository.save();
    res.json({
      message: "Repository Visibility toggled Successfully!",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error(`Uable to Change Visibility due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "User Repository Not Found!" });
    }
    res.json({ message: "Repository Deleted Successfully!" });
  } catch (error) {
    console.error(`Uable to Delete Repository due to ${error}`);
    res.status(500).send("Server Error");
  }
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
