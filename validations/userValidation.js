const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  userLevel: Joi.string().required(),
  role: Joi.number().required(),
  tabs: Joi.array().items(Joi.number()).required(),
});

module.exports = {
  userSchema,
};
