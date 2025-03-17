const express=require('express');
const getRouter = express.Router();
const fs = require('fs');
const data="./data";
if (!fs.existsSync(data)){
    fs.mkdirSync(data);
}
module.exports = getRouter;