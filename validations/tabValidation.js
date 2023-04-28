const Joi = require("joi");

const tabSchema = Joi.object({
  tabName: Joi.string().required(),
});

module.exports = {
  tabSchema,
};
