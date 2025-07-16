require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    // Probar una consulta simple
    const res = await pool.query("SELECT NOW()");
    console.log(
      "✅ Conexión exitosa. Hora actual del servidor PostgreSQL:",
      res.rows[0].now
    );
    await pool.end();
  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error.message);
  }
})();
