const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
  },

  repositories: [
    {
      default: [],
      tyepe: Schema.Types.ObjectId,
      ref: "Repository",
    },
  ],

  follewedUsers: [
    {
      default: [],
      tyepe: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],

  starRepos: [
    {
      default: [],
      tyepe: Schema.Types.ObjectId,
      ref: "Repository",
    },
  ],
});

const User = mongoose.model("Users", UserSchema);
export default User;
