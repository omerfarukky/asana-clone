const express = require("express");
const SectionController = require("../controllers/Section");
const schemas = require("../validations/Sections"); // Validations
const validate = require("../middlewares/validate"); // Validate middlevare
const authenticate = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");

const router = express.Router();

router.route("/:projectId").get(idChecker("projectId"), authenticate, SectionController.index);
router.route("/").post(authenticate, validate(schemas.createValidation), SectionController.create);
router.route("/:id").patch(idChecker(), authenticate, validate(schemas.updateValidation), SectionController.update);
router.route("/:id").delete(idChecker(), authenticate, SectionController.deleteSection);

module.exports = router;
