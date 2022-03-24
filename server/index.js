const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});