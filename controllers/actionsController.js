const { recordActionOnChain } = require("../services/blockchainService");
const {
  saveActionToDB,
  getAllActions,
  getActionsByUser,
} = require("../services/dbService");

const registerAction = async (req, res) => {
  const { userAddress, description } = req.body;
  if (!userAddress || !description) {
    return res
      .status(400)
      .json({ error: "userAddress y description son requeridos" });
  }

  try {
    const txHash = await recordActionOnChain(description);
    const timestamp = Math.floor(Date.now() / 1000);
    const action = await saveActionToDB(userAddress, description, timestamp);

    res.status(201).json({
      message: "Acción registrada correctamente en blockchain y base de datos.",
      blockchainTxHash: txHash,
      action,
    });
  } catch (error) {
    console.error("Error al registrar acción:", error);
    res.status(500).json({ error: "Error interno al registrar la acción" });
  }
};

const listActions = async (req, res) => {
  try {
    const actions = await getAllActions();
    res.json(actions);
  } catch (error) {
    console.error("Error al obtener acciones:", error);
    res.status(500).json({ error: "Error interno al obtener acciones" });
  }
};

const listActionsByUser = async (req, res) => {
  const { userAddress } = req.params;
  try {
    const actions = await getActionsByUser(userAddress);
    res.json(actions);
  } catch (error) {
    console.error("Error al obtener acciones del usuario:", error);
    res
      .status(500)
      .json({ error: "Error interno al obtener acciones del usuario" });
  }
};

module.exports = {
  registerAction,
  listActions,
  listActionsByUser,
};
