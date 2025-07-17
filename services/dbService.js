const {
  insertAction,
  getAllActions,
  getActionsByUser,
} = require("../models/actionModel");

const saveActionToDB = async (userAddress, description, timestamp) => {
  return await insertAction(userAddress, description, timestamp);
};

// Función específica para eventos de blockchain
const saveEventAction = async ({ user, description, timestamp }) => {
  return await insertAction(user, description, timestamp);
};

const fetchAllActions = async () => {
  return await getAllActions();
};

const fetchActionsByUser = async (userAddress) => {
  return await getActionsByUser(userAddress);
};

module.exports = {
  saveActionToDB,
  saveEventAction,
  getAllActions: fetchAllActions,
  getActionsByUser: fetchActionsByUser,
};
