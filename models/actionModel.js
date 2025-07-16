const pool = require("../config/db");

const insertAction = async (userAddress, description, timestamp) => {
  const query = `
    INSERT INTO actions (user_address, description, timestamp)
    VALUES ($1, $2, to_timestamp($3))
    RETURNING *;
  `;
  const values = [userAddress, description, timestamp];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllActions = async () => {
  const query = `SELECT * FROM actions ORDER BY timestamp DESC;`;
  const { rows } = await pool.query(query);
  return rows;
};

const getActionsByUser = async (userAddress) => {
  const query = `
    SELECT * FROM actions WHERE user_address = $1 ORDER BY timestamp DESC;
  `;
  const { rows } = await pool.query(query, [userAddress]);
  return rows;
};

module.exports = {
  insertAction,
  getAllActions,
  getActionsByUser,
};
