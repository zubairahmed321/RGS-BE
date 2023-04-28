const express = require("express");

const {
  getAllCardInfo,
  createCardInfo,
  updateCardInfo,
} = require("../controllers/cardControllers");

const { validateRequest } = require("../middleware/validateRequest");

const { cardSchema } = require("../validations/cardValidation");

const router = express.Router();

router.get("/", getAllCardInfo);

router.post("/:orderId", validateRequest(cardSchema), createCardInfo);

router.patch("/:orderId", validateRequest(cardSchema), updateCardInfo);

module.exports = router;
