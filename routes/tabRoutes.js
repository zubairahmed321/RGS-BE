const express = require("express");

const {
  getAllTabs,
  createTab,
  updateTab,
  deleteTab,
} = require("../controllers/tabControllers");
const { tabSchema } = require("../validations/tabValidation");
const { validateRequest } = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", getAllTabs);

router.post("/", validateRequest(tabSchema), createTab);

router.patch("/:id", validateRequest(tabSchema), updateTab);

router.delete("/:id", deleteTab);

module.exports = router;
