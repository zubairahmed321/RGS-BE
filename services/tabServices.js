const { pool } = require("../config/dbconfig");
const { TAB_RESPONSES } = require("../constants/responses");

const getAllTabs = async () => {
  const [result] = await pool.query("SELECT * FROM tabs");
  return result;
};

const createTab = async (tabName) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(`INSERT INTO tabs (tabName) VALUES (?)`, [tabName]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const updateTab = async (id, tabName) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(`UPDATE tabs SET tabName = ? WHERE id = ?`, [tabName, id]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const deleteTab = async (id) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await pool.query(`DELETE FROM tabs WHERE id = ?`, [id]);

    if (!result.affectedRows) {
      await conn.rollback();
      throw new Error(TAB_RESPONSES.NOT_FOUND);
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllTabs,
  createTab,
  updateTab,
  deleteTab,
};
