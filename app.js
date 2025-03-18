const express =require('express');
const getRouter = require('./routes/getRoutes');
const postRouter = require('./routes/postRoutes');
const putRouter = require('./routes/putRoutes');
const deleteRouter = require('./routes/deleteRoutes');
const app = express();
const port=4000;
app.use("/",getRouter)
app.use("/",postRouter)
app.use("/",putRouter)
app.use("/",deleteRouter)
app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
});