require("dotenv").config();
const express = require("express");
const cors = require("cors");
const actionsRoutes = require("./routes/actionsRoutes");
const setupSwagger = require("./config/swagger");
const { startBlockchainListeners } = require("./listeners/blockchainListener");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
setupSwagger(app);

// Rutas
app.use("/actions", actionsRoutes);

// Iniciar el listener de eventos en blockchain 🧠
startBlockchainListeners();

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
