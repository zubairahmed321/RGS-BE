const express = require("express");

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
const { login } = require("../controllers/authControllers");

const { checkDuplicateEmail } = require("../middleware/duplicateEmail");
const { validateRequest } = require("../middleware/validateRequest");

const { userSchema } = require("../validations/userValidation");
const { loginSchema } = require("../validations/loginValidation");

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getSingleUser);

router.post("/", validateRequest(userSchema), checkDuplicateEmail, createUser);

router.patch("/:id", validateRequest(userSchema), updateUser);

router.delete("/:id", deleteUser);

// auth

router.post("/login", validateRequest(loginSchema), login);

module.exports = router;
