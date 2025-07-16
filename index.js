require("dotenv").config();
const express = require("express");
const cors = require("cors");
const actionsRoutes = require("./routes/actionsRoutes");
const setupSwagger = require("./config/swagger");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
setupSwagger(app);

// Rutas
app.use("/actions", actionsRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
