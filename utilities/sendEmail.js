const { transporter } = require("../config/email.config");

const sendWelcomeEmail = (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome",
    html: `
      <p>Please click the following link to to your account</p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <a href="${process.env.FRONT_END_DOMAIN}/login">Login To Your Account</a>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log("Email sent: " + info.response);
  });
};

const contactMail = (name, email, phone, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_FROM,
    subject: "Contact Mail",
    html: `
      <h1>Test Mail.</h1>
      <p>name: ${name}</p>
      <p>email: ${email}</p>
      <p>phone: ${phone}</p>
      <p>subject: ${subject}</p>
      <p>message: ${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log("Email sent: " + info.response);
  });
};

const getQuote = (
  firstName,
  lastName,
  email,
  phone,
  service,
  whatAreYouShipping,
  pickupAddress,
  deliveryAddress,
  contactAtDeliveryNumber
) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_FROM,
    subject: "Get Quote Mail",
    html: `
      <h1>Test Mail.</h1>
      <p>firstName: ${firstName}</p>
      <p>lastName: ${lastName}</p>
      <p>email: ${email}</p>
      <p>phone: ${phone}</p>
      <p>service: ${service}</p>
      <p>whatAreYouShipping: ${whatAreYouShipping}</p>
      <p>pickupAddress: ${pickupAddress}</p>
      <p>deliveryAddress: ${deliveryAddress}</p>
      <p>contactAtDeliveryNumber: ${contactAtDeliveryNumber}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log("Email sent: " + info.response);
  });
};

const calculateCost = (
  transportFrom,
  transportTo,
  transportType,
  vehicleYear,
  vehicleMake,
  vehicleModel,
  isOperable,
  email,
  firstAvailableData,
  phone
) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_FROM,
    subject: "Calculate Cost Mail",
    html: `
      <h1>Test Mail.</h1>
      <p>transportFrom: ${transportFrom}</p>
      <p>transportTo: ${transportTo}</p>
      <p>transportType: ${transportType}</p>
      <p>vehicleYear: ${vehicleYear}</p>
      <p>vehicleMake: ${vehicleMake}</p>
      <p>vehicleModel: ${vehicleModel}</p>
      <p>isOperable: ${isOperable}</p>
      <p>email: ${email}</p>
      <p>firstAvailableData: ${firstAvailableData}</p>
      <p>firstName: ${firstName}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log("Email sent: " + info.response);
  });
};

module.exports = {
  sendWelcomeEmail,
  contactMail,
  getQuote,
  calculateCost,
};
