const { pool } = require("../config/dbconfig");
const { genericResponse, ORDER_RESPONSES } = require("../constants/responses");

const getAllOrders = async (queryParams) => {
  let query = `
    SELECT
      orders.id,
      orders.customer_full_name,
      orders.customer_email,
      orders.customer_phone,
      orders.pickup_city_adress_zip,
      orders.delivery_city_adress_zip,
      orders.source,
      CONCAT("[",
        GROUP_CONCAT(
          JSON_OBJECT(
            "vehicle_year", vehicle_info.vehicle_year,
            "vehicle_make", vehicle_info.vehicle_make,
            "vehicle_model", vehicle_info.vehicle_model,
            "vehicle_available_date", vehicle_info.vehicle_available_date
          )
        )
      ,"]") AS vehicleInfo
    FROM orders
    INNER JOIN vehicle_info ON orders.id = vehicle_info.order_id`;

  let params = [];

  if (queryParams.tab) {
    query += ` WHERE orders.tab_id = ?`;
    params.push(queryParams.tab);
  }

  if (queryParams.search) {
    if (queryParams.tab) {
      query += " AND orders.customer_full_name LIKE ?";
    } else {
      query += " WHERE orders.customer_full_name LIKE ?";
    }

    params.push(`%${queryParams.search}%`);
  }

  query += ` GROUP BY orders.id`;

  if (queryParams.page) {
    const pageNumber = Number(queryParams.page) || 1;
    const offset =
      (pageNumber - 1) * parseInt(process.env.NUMBER_OF_RECORDS_IN_ONE_PAGE);

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(process.env.NUMBER_OF_RECORDS_IN_ONE_PAGE), offset);
  }

  const [results] = await pool.query(query, params);
  return results;
};

const getOrderIds = async (queryParams) => {
  let query = "SELECT id FROM orders";

  if (queryParams.isQuoteGenerated === "false") {
    query += " WHERE isQuoteGenerated = 0";
  } else if (queryParams.isCardAdded === "false") {
    query += " WHERE isCardAdded = 0";
  }

  const [results] = await pool.query(query);
  const alteredResult = results.map((result) => result.id);

  return alteredResult;
};

const getSingleOrder = async (id) => {
  const [result] = await pool.query(`SELECT * FROM orders WHERE id = ?`, id);

  if (!result.length) {
    return null;
  }

  return result[0];
};

const createOrder = async (userId, orderData) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [{ insertId }] = await pool.query(
      `INSERT INTO orders
        (customer_full_name, customer_email, customer_phone, customer_2nd_phone, pickup_adress, pickup_city_adress_zip,
          delivery_adress, delivery_city_adress_zip, tab_id, source, created_by, access_given_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.customerFullName,
        orderData.customerEmail,
        orderData.customerPhone,
        orderData.customer2ndPhone,
        orderData.pickupAdress,
        orderData.pickupCityAdressZip,
        orderData.deliveryAdress,
        orderData.deliveryCityAdressZip,
        process.env.DEFAULT_TAB_ID,
        orderData.source,
        userId,
        userId,
      ]
    );

    await pool.query(
      `UPDATE tabs SET number_of_orders = number_of_orders + 1 WHERE id = ${process.env.DEFAULT_TAB_ID}`
    );

    let values = orderData.vehicleInfos.map((vehicleInfo) => {
      return [
        insertId,
        vehicleInfo.year,
        vehicleInfo.make,
        vehicleInfo.model,
        vehicleInfo.color,
        vehicleInfo.availableDate,
        vehicleInfo.isInAuction,
        vehicleInfo.condition,
        vehicleInfo.carrierType,
      ];
    });

    await pool.query(
      `INSERT INTO vehicle_info
        (order_id, vehicle_year, vehicle_make, vehicle_model, vehicle_color, vehicle_available_date,
            vehicle_is_in_auction, vehicle_condition, vehicle_carrier_type)
        VALUES ?`,
      [values]
    );

    await conn.commit();

    // will do calculation here, and return result.
    // ...
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const updateOrder = async (id, orderData) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(
      `UPDATE orders SET
        customer_full_name = ?,
        customer_email = ?,
        customer_phone = ?,
        customer_2nd_phone = ?,
        customer_fax = ?,
        customer_address = ?,

        pickup_contact_name = ?,
        pickup_email_address = ?,
        pickup_phone = ?,
        pickup_second_phone = ?,
        pickup_adress = ?,
        pickup_city_adress_zip = ?,

        delivery_contact_name = ?,
        delivery_email_address = ?,
        delivery_phone = ?,
        delivery_second_phone = ?,
        delivery_adress = ?,
        delivery_city_adress_zip = ?,

        additional_vehicle_information = ?,
        your_signature = ?,

        isQuoteGenerated = ?
      WHERE id = ?`,
      [
        orderData.customerFullName,
        orderData.customerEmail,
        orderData.customerPhone,
        orderData.customer2ndPhone,
        orderData.customerFax,
        orderData.customerAdress,

        orderData.pickupContactName,
        orderData.pickupEmailAddress,
        orderData.pickupPhone,
        orderData.pickupSecondPhone,
        orderData.pickupAdress,
        orderData.pickupCityAdressZip,

        orderData.deliveryContactName,
        orderData.deliveryEmailAddress,
        orderData.deliveryPhone,
        orderData.deliverySecondPhone,
        orderData.deliveryAdress,
        orderData.deliveryCityAdressZip,

        orderData.additionalVehicleInformation,
        orderData.confirmOrderYourSignature,

        1,
        id,
      ]
    );

    await pool.query(`DELETE FROM vehicle_info WHERE order_id = ?`, [id]);

    for (const vehicleInfo of orderData.vehicleInfos) {
      const [{ insertId }] = await pool.query(
        `INSERT INTO vehicle_info
            (order_id, vehicle_year, vehicle_make, vehicle_model, vehicle_brakes, vehicle_rolls, vehicle_color,
              vehicle_condition, vehicle_carrier_type, vehicle_available_date, vehicle_is_in_auction)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          vehicleInfo.year,
          vehicleInfo.make,
          vehicleInfo.model,
          vehicleInfo.brakes,
          vehicleInfo.rolls,
          vehicleInfo.color,
          vehicleInfo.condition,
          vehicleInfo.carrierType,
          vehicleInfo.availableDate,
          vehicleInfo.isInAuction,
        ]
      );

      if (vehicleInfo.isInAuction === 1) {
        await pool.query(
          `INSERT INTO auction_details
              (vehicle_id, auction_name, auction_buyer_number, auction_last_8_of_vin, auction_dealer_number, auction_lot_or_stock_number)
              VALUES (?, ?, ?, ?, ?, ?)`,
          [
            insertId,
            vehicleInfo.auctionDetails.auctionName,
            vehicleInfo.auctionDetails.auctionBuyerNumber,
            vehicleInfo.auctionDetails.auctionLast8OfVin,
            vehicleInfo.auctionDetails.auctionDealerNumber,
            vehicleInfo.auctionDetails.auctionLotOrStockNumber,
          ]
        );
      }
    }

    await conn.commit();

    return true;
  } catch (error) {
    await conn.rollback();

    throw error;
  } finally {
    conn.release();
  }
};

const giveAccessTo = async (orderId, userId) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(
      `UPDATE orders SET access_given_to = ? 
      WHERE id = ?`,
      [userId, orderId]
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw new Error(error);
  } finally {
    conn.release();
  }
};

const updateOrdersTab = async (tabId, ordersId, followMoreDate) => {
  const conn = await pool.getConnection();

  if (!tabId || !Array.isArray(ordersId)) {
    return genericResponse(
      400,
      false,
      null,
      ORDER_RESPONSES.MISSING_PROPERTIES
    );
  }

  try {
    await conn.beginTransaction();

    for (const orderId of ordersId) {
      await pool.query(
        `UPDATE tabs SET number_of_orders = number_of_orders - 1
            WHERE id = (SELECT tab_id FROM orders WHERE id = ?)`,
        [orderId]
      );

      await pool.query(
        `UPDATE orders SET tab_id = ?, follow_more_date = ? WHERE id = ?`,
        [tabId, followMoreDate, orderId]
      );
    }

    await pool.query(
      `UPDATE tabs SET number_of_orders = number_of_orders + ${ordersId.length} WHERE id = ?`,
      [tabId]
    );

    await conn.commit();

    return genericResponse(
      200,
      true,
      null,
      null,
      ORDER_RESPONSES.TAB_UPDATED_SUCCESS
    );
  } catch (error) {
    await conn.rollback();

    throw error;
  } finally {
    conn.release();
  }
};

const deleteOrder = async (id) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await pool.query(
      `UPDATE tabs SET number_of_orders = number_of_orders - 1
              WHERE id = (SELECT tab_id FROM orders WHERE id = ?)`,
      [id]
    );

    const [result] = await pool.query(`DELETE FROM orders WHERE id = ?`, [id]);

    await conn.commit();

    return result;
  } catch (error) {
    await conn.rollback();

    throw new Error(ORDER_RESPONSES.FAIL);
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllOrders,
  getOrderIds,
  getSingleOrder,
  createOrder,
  giveAccessTo,
  updateOrder,
  updateOrdersTab,
  deleteOrder,
};
