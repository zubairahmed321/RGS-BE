const { pool } = require("../config/dbconfig");
const { CARD_RESPONSES } = require("../constants/responses");

const getAllCardInfo = async (query) => {
  let q = "SELECT * FROM card_info";
  const params = [];

  if (query.search) {
    q += " WHERE full_name LIKE ?";
    params.push(`%${query.search}%`);
  }

  if (query.page) {
    const offset =
      (query.page - 1) * parseInt(process.env.NUMBER_OF_RECORDS_IN_ONE_PAGE);
    q += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(process.env.NUMBER_OF_RECORDS_IN_ONE_PAGE), offset);
  }

  const [result] = await pool.query(q, params);

  if (!result.length) {
    return {
      status: 404,
      success: false,
      data: null,
      message: CARD_RESPONSES.NOT_FOUND,
    };
  }

  return { status: 200, success: true, data: result, message: null };
};

const createCardInfo = async (orderId, cardInfo) => {
  const { fullName, cardExpire, cardNumber, cardAddress, cardCsv, cardZip } =
    cardInfo;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(
      `INSERT INTO card_info (order_id, full_name, card_expire, card_number, card_address, card_csv, card_zip)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, fullName, cardExpire, cardNumber, cardAddress, cardCsv, cardZip]
    );

    await pool.query(`UPDATE orders SET isCardAdded = 1 WHERE id = ?`, [
      orderId,
    ]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const updateCardInfo = async (orderId, cardInfo) => {
  const { fullName, cardExpire, cardNumber, cardAddress, cardCsv, cardZip } =
    cardInfo;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(
      `UPDATE card_info 
            SET full_name = ?, card_expire = ?, card_number = ?, card_address = ?, card_csv = ?, card_zip = ?
            WHERE order_id = ?`,
      [fullName, cardExpire, cardNumber, cardAddress, cardCsv, cardZip, orderId]
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
  getAllCardInfo,
  createCardInfo,
  updateCardInfo,
};
