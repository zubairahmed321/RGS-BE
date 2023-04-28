const Joi = require("joi");

const orderSchema = Joi.object({
  customerFullName: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerPhone: Joi.string().required(),
  customer2ndPhone: Joi.string().allow(null).optional(),
  customerFax: Joi.string().allow(null).optional(),
  customerAdress: Joi.string().allow(null).optional(),

  pickupContactName: Joi.string().allow(null).optional(),
  pickupEmailAddress: Joi.string().email().allow(null).optional(),
  pickupPhone: Joi.string().allow(null).optional(),
  pickupSecondPhone: Joi.string().allow(null).optional(),
  pickupAdress: Joi.string().required(),
  pickupCityAdressZip: Joi.string().required(),

  deliveryContactName: Joi.string().allow(null).optional(),
  deliveryEmailAddress: Joi.string().email().allow(null).optional(),
  deliveryPhone: Joi.string().allow(null).optional(),
  deliverySecondPhone: Joi.string().allow(null).optional(),
  deliveryAdress: Joi.string().required(),
  deliveryCityAdressZip: Joi.string().required(),

  additionalVehicleInformation: Joi.string().allow(null).optional(),
  confirmOrderYourSignature: Joi.string().allow(null).optional(),

  vehicleInfos: Joi.array().items(
    Joi.object({
      year: Joi.number().required(),
      make: Joi.string().required(),
      model: Joi.string().required(),

      brakes: Joi.number().allow(null).optional(),
      rolls: Joi.number().allow(null).optional(),

      color: Joi.string().required(),
      condition: Joi.number().required(),
      carrierType: Joi.number().required(),
      availableDate: Joi.date().required(),

      isInAuction: Joi.number().required(),

      auctionDetails: Joi.when("isInAuction", {
        is: 1,
        then: Joi.object({
          auctionName: Joi.string().required(),
          auctionBuyerNumber: Joi.string().required(),
          auctionLast8OfVin: Joi.string().required(),
          auctionDealerNumber: Joi.string().required(),
          auctionLotOrStockNumber: Joi.string().required(),
        }),
        otherwise: Joi.forbidden(),
      }).optional(),
    })
  ),

  source: Joi.string().optional(),
});

module.exports = {
  orderSchema,
};
