const tabService = require("../services/tabServices");
const { genericResponse, TAB_RESPONSES } = require("../constants/responses");

const getAllTabs = async (req, res) => {
  try {
    const result = await tabService.getAllTabs();

    if (!result.length) {
      const response = genericResponse(
        400,
        false,
        null,
        TAB_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(200, true, result);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const createTab = async (req, res) => {
  const { tabName } = req.body;

  try {
    await tabService.createTab(tabName);

    const response = genericResponse(
      201,
      true,
      null,
      null,
      TAB_RESPONSES.CREATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateTab = async (req, res) => {
  const { tabName } = req.body;
  const id = req.params.id;

  try {
    await tabService.updateTab(id, tabName);

    const response = genericResponse(
      200,
      true,
      null,
      null,
      TAB_RESPONSES.UPDATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const deleteTab = async (req, res) => {
  const id = req.params.id;

  try {
    await tabService.deleteTab(id);

    const response = genericResponse(
      200,
      true,
      null,
      null,
      TAB_RESPONSES.DELETE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const statusCode = error.message === TAB_RESPONSES.NOT_FOUND ? 404 : 500;

    const response = genericResponse(statusCode, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllTabs,
  createTab,
  updateTab,
  deleteTab,
};
