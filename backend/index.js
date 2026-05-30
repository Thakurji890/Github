const express = require("express");
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.json({ message: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
