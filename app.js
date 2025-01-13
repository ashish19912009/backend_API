require('dotenv').config({path: `${process.cwd()}/.env`}); 
const express = require('express');
const authRouter = require('./route/authRoute');
const projectRouter = require('./route/projectRoute');
const catchAsync = require("./utils/catchAsync");
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const app = express();


// PORT
const PORT = process.env.APP_PORT || 4000;

app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).json({
        status: 'success',
        message: 'Server Up and Running'
    })
});

// all routes will be here

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/projects', projectRouter)

app.use('*',catchAsync(async (req,res,next)=>{
    throw new AppError(`Can't find ${req.originalUrl} on the server`, 404);
   //return next(new Error('This is error')); 
}));

app.use(globalErrorHandler);



app.listen(PORT, ()=>{
    console.log("server up and runnings", PORT)
})