const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const { title, description, repository } = req.body;
  const { id } = req.params;

  try {
    const repositoryId = repository || id;
    const issue = new Issue({ title, description, repository: repositoryId });
    await issue.save();

    res.status(201).json(issue);
  } catch (error) {
    console.error(`Unable to Create Issue Due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue Not Found!" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json({ message: "Issue Updated!", issue });
  } catch (error) {
    console.error(`Unable to Update Issue Due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const deleteIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue Not Found!" });
    }

    res.json({ message: "Issue Deleted!" });
  } catch (error) {
    console.error(`Unable to Delete Issue Due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find({});

    if (!issues) {
      return res.status(404).json({ message: "Issue Not Found!" });
    }
    res.status(200).json(issues);
  } catch (error) {
    console.error(`Unable Fetching Issue Due to ${error}`);
    res.status(500).send("Server Error");
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue Not Found!" });
    }

    res.send(issue);
  } catch (error) {
    console.error(`Unable Fetching Issue Due to ${error}`);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
