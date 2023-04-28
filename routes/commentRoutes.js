const express = require("express");

const {
  getAllCommentsOnOrder,
  createComment,
} = require("../controllers/commentControllers");
const { commentSchema } = require("../validations/commentValidation");
const { validateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.get("/:orderId", getAllCommentsOnOrder);

router.post("/", validateRequest(commentSchema), createComment);

module.exports = router;
