const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXP,
  });
};

const signup = catchAsync(async (req, res, next) => {
  // res.json({
  //     status: 'success',
  //     message: 'Singh route are working'
  // });
  const body = req.body;
  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("Invalid user Type", 400);
  }

  const newUser = await user.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create the user", 400));
    // return res.status(400).json({
    //     status:'fail',
    //     message: 'Failed to create user'
    // });
  }

  const result = newUser.toJSON();
  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { loginID, password } = req.body;

  if (!loginID || !password) {
    return next(new AppError("Please provide login and password", 400));
  }

  const userDetails = await user.findOne({ where: { email: loginID } });
  const checkPassword = await bcrypt.compare(password, userDetails.password);
  if (!userDetails || !checkPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = generateToken({
    id: userDetails.id,
  });

  return res.status(200).json({
    status: "success",
    token,
  });
});

const authentication = catchAsync(async (req, res, next) => {
  // 1. get the token from headers
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(new AppError("Please login to get the access", 401));
  }
  // token verification
  const tokenDetails = await jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  // get the user detail from db and add to req object
  const getUser = await user.findByPk(tokenDetails.id);

  if (!getUser) {
    return next(new AppError("User no longer exists", 400));
  }
  req.user = getUser;
  return next();
});

const authorization = (userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

module.exports = { signup, login, authentication, authorization };
