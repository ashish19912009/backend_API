const project = require("../db/models/project");
const { user } = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const user = req.user;
  const newProject = await project.create({
    title: body.title,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    productUrl: body.productUrl,
    category: body.category,
    tags: body.tags,
    createdBy: user.id,
  });

  return res.status(201).json({
    status: "success",
    data: newProject,
  });
});

const getAllProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await project.findAll({
    include: user,
    where: {
      createdBy: userId,
    },
  });

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const getProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await project.findByPk(id, {
    include: user,
  });

  if (!result) {
    return next(new AppError("Project not found", 400));
  }
  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const updateProject = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pId } = req.params;
  const result = await project.findOne({
    where: {
      id: pId,
      createdBy: userId,
    },
  });
  result.title = req.body.title;
  result.productImage = req.body.productImage;
  result.price = req.body.price;
  result.shortDescription = req.body.shortDescription;
  result.description = req.body.description;
  result.productUrl = req.body.productUrl;
  result.category = req.body.category;
  result.tags = req.body.tags;

  const updatedResult = await result.save();

  if (!updatedResult) {
    return next(new AppError("Project details not updated", 400));
  }
  return res.json({
    status: "success",
    data: updatedResult,
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pId } = req.params;
  const result = await project.findOne({
    where: {
      id: pId,
      createdBy: userId,
    },
  });

  const updatedResult = await result.destroy();
  if (!updatedResult) {
    return next(new AppError("Project details not updated", 400));
  }
  return res.json({
    status: "success",
    message: "Project details deleted successfully",
  });
});

module.exports = {
  createProject,
  getAllProject,
  getProject,
  updateProject,
  deleteProject,
};
