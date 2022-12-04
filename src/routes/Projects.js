const express = require("express");
const ProjectController = require("../controllers/Project");
const schemas = require("../validations/Projects"); // Validations
const validate = require("../middlewares/validate"); // Validate middlevare
const idChecker = require("../middlewares/idChecker"); // IdChecker middlevare
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(authenticate, ProjectController.index);
router.route("/").post(authenticate, validate(schemas.createValidation), ProjectController.create);
router.route("/:id").patch(idChecker(), authenticate, validate(schemas.updateValidation), ProjectController.update);
router.route("/:id").delete(idChecker(), authenticate, ProjectController.deleteProject);

module.exports = router;
