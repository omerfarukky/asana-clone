const express = require("express");
const TaskController = require("../controllers/Task");
const schemas = require("../validations/Tasks"); // Validations
const validate = require("../middlewares/validate"); // Validate middlevare
const authenticate = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");

const router = express.Router();

router.route("/").post(authenticate, validate(schemas.createValidation), TaskController.create);
router.route("/:id").patch(idChecker(), authenticate, validate(schemas.updateValidation), TaskController.update);
router.route("/:id/make-comment").post(idChecker(), authenticate, validate(schemas.commentValidation), TaskController.makeComment);
router.route("/:id/:commentId").delete(idChecker(), authenticate, TaskController.deleteComment);
router.route("/:id/add-sub-task").post(authenticate, validate(schemas.createValidation), TaskController.addSubTask);
router.route("/:id").get(idChecker(), authenticate, TaskController.fetchTask);
router.route("/:id").delete(idChecker(), authenticate, TaskController.deleteTask);

module.exports = router;
