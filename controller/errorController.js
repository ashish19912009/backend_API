const AppError = require("../utils/appError");
const { infoLogger } = require("./loggerController");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  return res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorInProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  // Error logger
  // infoLogger.log({
  //     level: 'info',
  //     message,
  // });
  console.log("Error Details ----> ", error.name, error.message, stack);
  //***********/

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong.",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  let error = "";
  if (err.name === "SequelizeUniqueConstraintError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid Token", 401);
  }
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
  sendErrorInProd(err, res);
};

module.exports = globalErrorHandler;
