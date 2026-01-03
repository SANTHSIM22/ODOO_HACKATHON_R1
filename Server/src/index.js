require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/connection");

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
