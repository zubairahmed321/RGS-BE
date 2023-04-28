const { genericResponse, CARD_RESPONSES } = require("../constants/responses");
const cardService = require("../services/cardServices");

const getAllCardInfo = async (req, res) => {
  try {
    const { status, success, data, message } = await cardService.getAllCardInfo(
      req.query
    );

    const response = genericResponse(status, success, data, message);
    return res.status(status).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const createCardInfo = async (req, res) => {
  try {
    await cardService.createCardInfo(req.params.orderId, req.body);

    const response = genericResponse(
      201,
      true,
      null,
      null,
      CARD_RESPONSES.CREATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateCardInfo = async (req, res) => {
  try {
    await cardService.updateCardInfo(req.params.orderId, req.body);

    const response = genericResponse(
      200,
      true,
      null,
      null,
      CARD_RESPONSES.UPDATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllCardInfo,
  createCardInfo,
  updateCardInfo,
};
