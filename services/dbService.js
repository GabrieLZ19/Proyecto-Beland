const {
  insertAction,
  getAllActions,
  getActionsByUser,
} = require("../models/actionModel");

const saveActionToDB = async (userAddress, description, timestamp) => {
  return await insertAction(userAddress, description, timestamp);
};

const fetchAllActions = async () => {
  return await getAllActions();
};

const fetchActionsByUser = async (userAddress) => {
  return await getActionsByUser(userAddress);
};

module.exports = {
  saveActionToDB,
  getAllActions: fetchAllActions,
  getActionsByUser: fetchActionsByUser,
};
