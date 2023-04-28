const jwt = require("jsonwebtoken");
const { pool } = require("../config/dbconfig");

const { genericResponse, USER_RESPONSES } = require("../constants/responses");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await pool.query(
      `SELECT users.id, users.username, users.email, users.password, users.userLevel, users.role, users.createdAt,
      CONCAT('[',GROUP_CONCAT(JSON_OBJECT(tabs.id, tabs.tabName)),']') AS usersTabs
      FROM users
      JOIN user_tabs ON users.id = user_tabs.user_id
      JOIN tabs ON user_tabs.tab_id = tabs.id
      WHERE users.email = ? AND users.password = ?
      GROUP BY users.id`,
      [email, password]
    );

    if (!result.length) {
      const response = genericResponse(
        401,
        false,
        null,
        USER_RESPONSES.AUTH.INCORRECT_CREDS
      );
      return res.status(response.status.code).json(response);
    }

    const token = jwt.sign(
      {
        userId: result[0].id,
        username: result[0].username,
        email: result[0].email,
        userLevel: result[0].userLevel,
        role: result[0].role,
        usersTabs: result[0].usersTabs,
      },
      process.env.SECRET_KEY
    );

    console.log("token___", token);

    const response = genericResponse(200, true, { token });
    return res.status(response.status.code).json(response);
  } catch (error) {
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = { login };
