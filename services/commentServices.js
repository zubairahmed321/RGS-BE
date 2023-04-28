const { pool } = require("../config/dbconfig");

const getAllCommentsOnOrder = async (orderId) => {
  const [results] = await pool.query(
    "SELECT comments.*, users.username FROM users JOIN comments ON comments.user_id = users.id WHERE order_id = ?",
    orderId
  );

  return results;
};

const createComment = async (userId, orderId, comment) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(
      `INSERT INTO comments (user_id, order_id, comment) VALUES (?, ?, ?)`,
      [userId, orderId, comment]
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllCommentsOnOrder,
  createComment,
};
