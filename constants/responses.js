const responses = {
  USER_RESPONSES: {
    NOT_FOUND: "No users found.",
    FAIL: "Could not find user with the id.",
    CREATE_SUCCESS: "User created successfully.",
    UPDATE_SUCCESS: "User updated successfully.",
    DELETE_SUCCESS: "User deleted successfully.",
    AUTH: {
      INCORRECT_CREDS: "Incorrect email or password",
    },
  },
  TAB_RESPONSES: {
    NOT_FOUND: "No tabs found.",
    FAIL: "Could not find tab with the id.",
    CREATE_SUCCESS: "Tab created successfully.",
    UPDATE_SUCCESS: "Tab updated successfully.",
    DELETE_SUCCESS: "Tab deleted successfully.",
  },
  COMMENT_RESPONSES: {
    NOT_FOUND: "No comments found.",
    CREATE_SUCCESS: "Comment created successfully.",
  },
  ORDER_RESPONSES: {
    NOT_FOUND: "No orders found.",
    FAIL: "Could not find order with the id.",
    CREATE_SUCCESS: "New order added successfully.",
    UPDATE_SUCCESS: "Order updated successfully.",
    DELETE_SUCCESS: "Order deleted successfully",
    MISSING_PROPERTIES: "Missing properties or ordersId is not an array.",
    TAB_UPDATED_SUCCESS: "Orders Tab updated successfully.",
    ACCESS_GIVEN_SUCCESS: "Order user access replaced successfully.",
  },
  CARD_RESPONSES: {
    NOT_FOUND: "No cards found.",
    CREATE_SUCCESS: "Card info added successfully.",
    UPDATE_SUCCESS: "Card info updated successfully.",
  },
  genericResponse: (
    status,
    success,
    data = null,
    error = null,
    message = null
  ) => {
    return {
      status: {
        code: status,
        success: success,
      },
      data: data,
      error: error,
      message: message,
    };
  },
};

module.exports = responses;
