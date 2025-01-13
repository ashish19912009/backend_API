const {
  createProject,
  getAllProject,
  getProject,
  updateProject,
  deleteProject,
} = require("../controller/productController");
const {
  authentication,
  authorization,
} = require("../controller/authController");
const router = require("express").Router();

// 1 - is User
// 0 - Admin
// 2 - seller
router
  .route("/")
  .post(authentication, authorization(["1"]), createProject)
  .get(authentication, authorization(["1"]), getAllProject);

router
  .route("/:id")
  .get(authentication, authorization(["1"]), getProject)
  .patch(authentication, authorization(["1"]), updateProject)
  .delete(authentication, authorization(["1"]), deleteProject);

module.exports = router;
