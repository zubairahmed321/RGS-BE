const Joi = require("joi");

const cardSchema = Joi.object({
  fullName: Joi.string().required(),
  cardExpire: Joi.string().required(),
  cardNumber: Joi.string().required(),
  cardAddress: Joi.string().required(),
  cardCsv: Joi.string().required(),
  cardZip: Joi.string().required(),
});

module.exports = {
  cardSchema,
};
