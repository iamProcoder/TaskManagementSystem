const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const db = require("./app/models");
const mongoConnection = require('./app/db/mongoConnection')
const routers = require('./app/routes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

db.sequelize.sync();

//mongo db conncection
mongoConnection();

app.get("/api", (req, res) => {
  res.json({ message: "app initialized" });
});

app.use("/api", routers);

const PORT = process.env.PORT || 1905;
app.listen(PORT, () => {
  console.log(`######## Server is running on port ${PORT}. always everywhere champion Galatasaray :) ########`);
});
