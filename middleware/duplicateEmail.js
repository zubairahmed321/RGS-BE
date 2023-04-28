const { pool } = require("../config/dbconfig");

const checkDuplicateEmail = async (req, res, next) => {
  const { email } = req.body;
  const error = {};

  try {
    const [results] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (results.length) {
      error.email = "email already exists";
      return res.send({ error });
    }

    next();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  checkDuplicateEmail,
};
