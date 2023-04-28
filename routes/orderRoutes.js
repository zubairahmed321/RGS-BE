const express = require("express");

const {
  getAllOrders,
  getOrderIds,
  getSingleOrder,
  createOrder,
  updateOrder,
  giveAccessTo,
  updateOrdersTab,
  deleteOrder,
} = require("../controllers/orderControllers");

const { validateRequest } = require("../middleware/validateRequest");
const { verifyJWT } = require("../middleware/verifyToken");

const { orderSchema } = require("../validations/orderValidation");

const router = express.Router();

router.get("/", getAllOrders); // will comeback here

router.get("/ids", getOrderIds);

router.patch("/updateOrdersTab", updateOrdersTab);

router.patch("/:orderId/giveAccessTo/:userId", giveAccessTo);

router.get("/:orderId", getSingleOrder); // will comeback here

router.post("/", validateRequest(orderSchema), createOrder);

router.patch("/:orderId", validateRequest(orderSchema), updateOrder);

router.delete("/:orderId", deleteOrder);

module.exports = router;
