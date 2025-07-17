const { ethers } = require("ethers");

const requiredEnvVars = {
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
};

// Verificar que todas las variables estén definidas
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("❌ Variables de entorno faltantes:", missingVars.join(", "));
  console.error("📝 Revisa tu archivo .env y asegúrate de tener configuradas:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  process.exit(1);
}

let provider, wallet, contract;

try {
  // Crear provider
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  console.log("✅ Provider de blockchain conectado");

  // Crear wallet
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("✅ Wallet configurada:", wallet.address);

  // Cargar ABI del contrato
  const abi = require("../contractABI.json");
  console.log("✅ ABI del contrato cargado");

  // Crear instancia del contrato
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
  console.log("✅ Contrato inicializado en:", process.env.CONTRACT_ADDRESS);
} catch (error) {
  console.error("❌ Error al configurar ethers.js:", error.message);
  console.error("🔧 Verifica:");
  console.error("   - Que RPC_URL sea válida");
  console.error("   - Que PRIVATE_KEY esté en formato correcto (sin 0x)");
  console.error("   - Que CONTRACT_ADDRESS sea una dirección válida");
  console.error("   - Que contractABI.json exista y tenga el formato correcto");
  process.exit(1);
}

module.exports = {
  provider,
  wallet,
  contract,
};
