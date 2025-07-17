const express = require("express");
const router = express.Router();
const {
  registerAction,
  listActions,
  listActionsByUser,
} = require("../controllers/actionsController");
const { getListenerStatus } = require("../listeners/blockchainListener");

/**
 * @swagger
 * /actions:
 *   post:
 *     summary: Registrar una nueva acción sostenible en blockchain y DB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - description
 *             properties:
 *               userAddress:
 *                 type: string
 *                 description: Dirección Ethereum del usuario
 *               description:
 *                 type: string
 *                 description: Descripción de la acción sostenible
 *     responses:
 *       201:
 *         description: Acción registrada correctamente
 *       400:
 *         description: Parámetros faltantes o inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", registerAction);

/**
 * @swagger
 * /actions:
 *   get:
 *     summary: Obtener todas las acciones registradas
 *     responses:
 *       200:
 *         description: Lista de acciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_address:
 *                     type: string
 *                   description:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 */
router.get("/", listActions);

/**
 * @swagger
 * /actions/{userAddress}:
 *   get:
 *     summary: Obtener acciones de un usuario específico
 *     parameters:
 *       - in: path
 *         name: userAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Dirección Ethereum del usuario
 *     responses:
 *       200:
 *         description: Lista de acciones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_address:
 *                     type: string
 *                   description:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 */
router.get("/:userAddress", listActionsByUser);

/**
 * @swagger
 * /actions/system/status:
 *   get:
 *     summary: Obtener el estado de los listeners de blockchain
 *     responses:
 *       200:
 *         description: Estado de los listeners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isListening:
 *                   type: boolean
 *                 activeListeners:
 *                   type: integer
 *                 listenerNames:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get("/system/status", (req, res) => {
  try {
    const status = getListenerStatus();
    res.json({
      message: "Estado del sistema de listeners",
      ...status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener estado del sistema",
      details: error.message,
    });
  }
});

module.exports = router;
