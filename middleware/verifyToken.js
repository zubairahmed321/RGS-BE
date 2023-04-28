const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};

const verifySuperAdmin = (req, res, next) => {
  const role = req.user.role;

  if (role !== 1) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

const verifyAdminOrUserIdWithSameResourceId = (req, res, next) => {
  let role;

  const userId = req.user.userId;
  const resourceId = parseInt(req.params.companyId);
  if (req.user.role) role = req.user.role;

  if (role === 0 || role === 1 || userId === resourceId) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  verifyJWT,
  verifySuperAdmin,
  verifyAdminOrUserIdWithSameResourceId,
};
