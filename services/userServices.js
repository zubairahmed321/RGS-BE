const randomstring = require("randomstring");

const { pool } = require("../config/dbconfig");

const { sendWelcomeEmail } = require("../utilities/sendEmail");

const getAllUsers = async (queryParams) => {
  let query = `SELECT id, username, email, password, userLevel, createdAt FROM users`;
  const params = [];

  if (queryParams.search) {
    query += " WHERE username LIKE ?";
    params.push(`%${queryParams.search}%`);
  }

  if (queryParams.page) {
    const pageNumber = Number(queryParams.page) || 1;
    const offset =
      (pageNumber - 1) * parseInt(process.env.NUMBER_OF_RECORDS_IN_ONE_PAGE);

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(process.env.NUMBER_OF_RECORDS_IN_ONE_PAGE), offset);
  }

  const [result] = await pool.query(query, params);

  return result;
};

const getSingleUser = async (id) => {
  const [result] = await pool.query(
    `SELECT users.id, users.username, users.email, users.password, users.userLevel, users.role, users.createdAt,
        CONCAT('[',GROUP_CONCAT(JSON_OBJECT(tabs.id, tabs.tabName)),']') AS usersTabs
        FROM users
        JOIN user_tabs ON users.id = user_tabs.user_id
        JOIN tabs ON user_tabs.tab_id = tabs.id
        WHERE users.id = ?
        GROUP BY users.id`,
    [id]
  );

  return result;
};

const createUser = async (userData) => {
  const { username, email, userLevel, role, tabs } = userData;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const password = randomstring.generate();

    const [{ insertId }] = await pool.query(
      `INSERT INTO users (username, email, password, userLevel, role) VALUES (?, ?, ?, ?, ?)`,
      [username, email, password, userLevel, role]
    );

    let values = tabs.map((tab) => [insertId, tab]);

    await pool.query(`INSERT INTO user_tabs (user_id, tab_id) VALUES ?`, [
      values,
    ]);

    await conn.commit();

    sendWelcomeEmail(email, password);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const updateUser = async (id, username, userLevel, password, tabs) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(
      `UPDATE users SET username = ?, userLevel = ?, password = ? WHERE id = ?`,
      [username, userLevel, password, id]
    );

    await pool.query(`DELETE FROM user_tabs WHERE user_id = ?`, [id]);

    let values = tabs.map((tab) => [id, tab]);

    await pool.query(`INSERT INTO user_tabs (user_id, tab_id) VALUES ?`, [
      values,
    ]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw new Error(error.message);
  } finally {
    conn.release();
  }
};

const deleteUser = async (id) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(`DELETE FROM users WHERE id = ?`, [id]);

    await conn.commit();

    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
