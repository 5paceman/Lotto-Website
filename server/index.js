const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 3001;

const apiUser = require("./routes/user");
const apiTicket = require("./routes/ticket");
const apiAuth = require("./routes/auth");

const app = express();

dotenv.config();
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use("/api/user", apiUser);
app.use("/api/ticket", apiTicket);
app.use("/api/auth", apiAuth);

module.exports = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});