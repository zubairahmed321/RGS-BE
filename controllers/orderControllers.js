const orderService = require("../services/orderServices");
const { genericResponse, ORDER_RESPONSES } = require("../constants/responses");

const getAllOrders = async (req, res) => {
  try {
    const results = await orderService.getAllOrders(req.query);

    if (!results.length) {
      const response = genericResponse(
        404,
        false,
        null,
        ORDER_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(200, true, results);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const getOrderIds = async (req, res) => {
  try {
    const results = await orderService.getOrderIds(req.query);

    const response = genericResponse(200, true, results);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const result = await orderService.getSingleOrder(req.params.orderId);

    if (!result) {
      const response = genericResponse(404, false, null, ORDER_RESPONSES.FAIL);
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(200, true, result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const createOrder = async (req, res) => {
  try {
    await orderService.createOrder(req?.user?.userId ?? null, req.body);

    const response = genericResponse(
      201,
      true,
      null,
      null,
      ORDER_RESPONSES.CREATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    await orderService.updateOrder(orderId, req.body);

    const response = genericResponse(
      201,
      true,
      null,
      null,
      ORDER_RESPONSES.UPDATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const giveAccessTo = async (req, res) => {
  const { orderId, userId } = req.params;

  try {
    await orderService.giveAccessTo(orderId, userId);

    const response = genericResponse(
      200,
      true,
      null,
      null,
      ORDER_RESPONSES.ACCESS_GIVEN_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateOrdersTab = async (req, res) => {
  const { tabId, ordersId, followMoreDate = null } = req.body;

  try {
    const response = await orderService.updateOrdersTab(
      tabId,
      ordersId,
      followMoreDate
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const result = await orderService.deleteOrder(orderId);

    if (!result.affectedRows) {
      const response = genericResponse(404, false, null, ORDER_RESPONSES.FAIL);
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(
      200,
      true,
      null,
      null,
      ORDER_RESPONSES.DELETE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllOrders,
  getOrderIds,
  getSingleOrder,
  createOrder,
  updateOrder,
  giveAccessTo,
  updateOrdersTab,
  deleteOrder,
};
