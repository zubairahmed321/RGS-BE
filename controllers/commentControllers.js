const commentService = require("../services/commentServices");
const {
  genericResponse,
  COMMENT_RESPONSES,
} = require("../constants/responses");

const getAllCommentsOnOrder = async (req, res) => {
  try {
    const comments = await commentService.getAllCommentsOnOrder(
      req.params.orderId
    );

    if (!comments.length) {
      const response = genericResponse(
        404,
        false,
        null,
        COMMENT_RESPONSES.NOT_FOUND
      );
      return res.status(response.status.code).json(response);
    }

    const response = genericResponse(200, true, comments);
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

const createComment = async (req, res) => {
  const { userId, orderId, comment } = req.body;

  try {
    await commentService.createComment(userId, orderId, comment);

    const response = genericResponse(
      200,
      true,
      null,
      null,
      COMMENT_RESPONSES.CREATE_SUCCESS
    );
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = {
  getAllCommentsOnOrder,
  createComment,
};

/*
const comment = [
        {
            orderId: 5,
            userId: 30,
            comment: "lorem ipsum1",
            parentId: null,
            replies: [
                {
                    orderId: 5,
                    userId: 30,
                    comment: "lorem ipsum2",
                    parentId: null,
                    replies: [
                        {
                            orderId: 5,
                            userId: 30,
                            comment: "lorem ipsum3",
                            parentId: null,
                            replies: [
                                {
                                    orderId: 5,
                                    userId: 30,
                                    comment: "lorem ipsum4",
                                    parentId: null,
                                    replies: []
                                },
                                {
                                    orderId: 5,
                                    userId: 30,
                                    comment: "lorem ipsum5",
                                    parentId: null,
                                    replies: []
                                },
                                {
                                    orderId: 5,
                                    userId: 30,
                                    comment: "lorem ipsum6",
                                    parentId: null,
                                    replies: []
                                }
                            ]
                        },
                        {
                            orderId: 5,
                            userId: 30,
                            comment: "lorem ipsum7",
                            parentId: null,
                            replies: []
                        }
                    ]
                },
                {
                    orderId: 5,
                    userId: 30,
                    comment: "lorem ipsum8",
                    parentId: null,
                    replies: []
                }
            ]
        },
        {
            orderId: 5,
            userId: 30,
            comment: "lorem ipsum9",
            parentId: null,
            replies: []
        },
        {
            orderId: 5,
            userId: 30,
            comment: "lorem ipsum10",
            parentId: null,
            replies: []
        }
]
*/
