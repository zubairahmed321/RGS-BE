const express = require("express");
const {
  contactMail,
  getQuote,
  calculateCost,
} = require("../utilities/sendEmail");

const router = express.Router();

router.post("/contact-us", (req, res) => {
  contactMail(...req.body);
  return res.send("mail sent.");
});

router.post("/get-quote", (req, res) => {
  getQuote(...req.body);
  return res.send("mail sent.");
});

router.post("/calculate-cost", (req, res) => {
  calculateCost(...req.body);
  return res.send("mail sent.");
});

module.exports = router;
