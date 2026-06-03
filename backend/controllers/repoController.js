const creatRepository = (req, res) => {
  res.send("Repository Created");
};

const getAllRepository = (req, res) => {
  res.send("All Repository Fetched");
};

const fetchRepositoryById = (req, res) => {
  res.send("All repository Details fetched");
};

const fetchRepositoryByName = (req, res) => {
  res.send("All repository Details fetched");
};

const fectchRepositoryForCurrentUser = (req, res) => {
  res.send("repositories for logged in user fectched");
};

const updateRepositoryById = (req, res) => {
  res.send("Repository Updated");
};

const toggleVisibilityById = (req, res) => {
  res.send("Visibility Toggled!");
};

const deleteRepositoryById = (req, res) => {
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
