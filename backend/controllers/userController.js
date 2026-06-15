const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
let client = null;

// for Object id from mongoose
let ObjectId = require("mongodb").ObjectId;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
}

// Signup logic

const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User Already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      follewedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "120h" },
    );

    res.json({ token, userId: result.insertedId });
  } catch (error) {
    console.error(`Connection Failed Due to ${error.message}`);
    res.status(500).send("Server Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db(process.env.DB_NAME);

    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credential!" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid Credential!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "120h",
    });

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error(`Connection Failed Due to ${error.message}`);
    res.status(500).send("Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    // connection establishing
    await connectClient();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error(`Connection Failed Due to ${error.message}`);
    res.status(500).send("Server Error");
  }
};

const getUserProfile = async (req, res) => {
  const currId = req.params.id;
  try {
    await connectClient();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(currId) });
    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    res.send(user);
  } catch (error) {
    console.error(`Connection Failed Due to ${error.message}`);
    res.status(500).send("Server Error");
  }
};

const updateUserProfile = async (req, res) => {
  const currId = req.params.id;
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("users");

    let updatedFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currId),
      },
      { $set: updatedFields },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    res.send(result.value);
  } catch (error) {
    console.error(
      `Unable to Update the latest changes due to ${error.message}`,
    );
    res.status(500).send("Server Error");
  }
};

const deleteUserProfile = async (req, res) => {
  const currId = req.params.id;
  try {
    await connectClient();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currId),
    });

    if (result.deletedCount == 0) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (error) {
    console.error(`Unable to Delete the Profile due to ${error.message}`);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
