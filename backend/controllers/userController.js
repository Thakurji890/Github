const getAllUsers = (req, res) => {
  res.send("All user fetched");
};

const signup = (req, res) => {
  res.send("Signing Up!");
};

const login = (req, res) => {
  res.send("Login user!");
};

const getUserProfile = (req, res) => {
  res.send("Profile Fetched");
};

const updateUserProfile = (req, res) => {
  res.send("Profile updated");
};

const deleteUserProfile = (req, res) => {
  res.send("Profile Deleted!");
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
