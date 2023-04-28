const userService = require("../services/userServices");
const { genericResponse, USER_RESPONSES } = require("../constants/responses");

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    if (!result.length) {
      const response = genericResponse(
        400,
        false,
        null,
        null,
        USER_RESPONSES.NOT_FOUND
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

const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userService.getSingleUser(id);

    if (!result.length) {
      const response = genericResponse(404, false, null, USER_RESPONSES.FAIL);
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(200, true, result[0]);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const createUser = async (req, res) => {
  try {
    await userService.createUser(req.body);

    const response = genericResponse(
      201,
      true,
      null,
      null,
      USER_RESPONSES.CREATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const updateUser = async (req, res) => {
  const { username, userLevel, password, tabs } = req.body;
  const { id } = req.params;

  try {
    await userService.updateUser(id, username, userLevel, password, tabs);

    const response = genericResponse(
      200,
      true,
      null,
      null,
      USER_RESPONSES.UPDATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);

    if (!result.affectedRows) {
      const response = genericResponse(404, false, null, USER_RESPONSES.FAIL);
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(
      200,
      true,
      null,
      null,
      USER_RESPONSES.DELETE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
