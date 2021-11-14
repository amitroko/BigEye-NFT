const express = require('express');
const app = express();
const mint = require('./mint.js');

app.listen(3000, () => {
    console.log("Server running on port 3000.");
})

app.get('/mint', (req, res) => {
    let r = mint.mintNew();
    res.send(r);
})