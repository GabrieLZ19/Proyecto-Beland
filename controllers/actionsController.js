const { recordActionOnChain } = require("../services/blockchainService");
const { getAllActions, getActionsByUser } = require("../services/dbService");
const { ethers } = require("ethers");

// Función para validar direcciones Ethereum
const isValidEthereumAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

const registerAction = async (req, res) => {
  const { userAddress, description } = req.body;
  if (!userAddress || !description) {
    return res
      .status(400)
      .json({ error: "userAddress y description son requeridos" });
  }

  // Validar que userAddress sea una dirección Ethereum válida
  if (!isValidEthereumAddress(userAddress)) {
    return res.status(400).json({
      error: "userAddress no es una dirección Ethereum válida",
      providedAddress: userAddress,
      tip: "Las direcciones Ethereum deben tener 42 caracteres (0x + 40 caracteres hexadecimales: 0-9, a-f)",
    });
  }

  try {
    const txHash = await recordActionOnChain(userAddress, description);

    res.status(201).json({
      message:
        "Acción registrada correctamente en blockchain. Se guardará automáticamente cuando se confirme la transacción.",
      blockchainTxHash: txHash,
      userAddress,
      description,
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

  // Validar que userAddress sea una dirección Ethereum válida
  if (!isValidEthereumAddress(userAddress)) {
    return res.status(400).json({
      error: "userAddress no es una dirección Ethereum válida",
      providedAddress: userAddress,
      tip: "Las direcciones Ethereum deben tener 42 caracteres (0x + 40 caracteres hexadecimales: 0-9, a-f)",
    });
  }

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
