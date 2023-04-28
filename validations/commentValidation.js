const Joi = require("joi");

const commentSchema = Joi.object({
  userId: Joi.number().required(),
  orderId: Joi.number().required(),
  comment: Joi.string().required(),
});

module.exports = {
  commentSchema,
};
