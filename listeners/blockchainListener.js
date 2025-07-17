const { saveEventAction } = require("../services/dbService");

let isListening = false;
let eventListeners = [];

const startBlockchainListeners = () => {
  if (isListening) {
    console.log("⚠️ Los listeners ya están activos");
    return;
  }

  try {
    const { contract, provider } = require("../config/ethers");

    // Validar que el contrato esté disponible
    if (!contract) {
      console.error("❌ No se puede iniciar listeners: contrato no disponible");
      console.error("🔧 Verifica tu configuración de ethers.js");
      return;
    }

    console.log("🔍 Contrato obtenido para listeners:", contract.target);

    // Configurar el listener de eventos
    const actionListener = contract.on(
      "ActionRecorded",
      async (user, description, timestamp, event) => {
        try {
          const ts = Number(timestamp);

          // Validar que el timestamp sea un número válido
          if (isNaN(ts) || ts <= 0) {
            throw new Error(`Timestamp inválido: ${timestamp}`);
          }

          // Convertir timestamp Unix a fecha legible
          const dateTime = new Date(ts * 1000);

          const txHash = event.log.transactionHash;

          const savedAction = await saveEventAction({
            user,
            description,
            timestamp: ts,
          });

          console.log("✅ Evento de blockchain guardado:", {
            txHash: txHash,
            user,
            description,
            timestamp: ts,
            dateTime: dateTime.toLocaleString("es-ES", {
              timeZone: "America/Mexico_City",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            dbId: savedAction.id,
          });
        } catch (err) {
          console.error("❌ Error al guardar evento de blockchain:", {
            error: err.message,
            user,
            description,
            timestamp: timestamp?.toString(),
            txHash: event?.log?.transactionHash || "hash_no_disponible",
          });
        }
      }
    );

    eventListeners.push({ name: "ActionRecorded", listener: actionListener });
    isListening = true;

    console.log("📡 Listeners de blockchain iniciados correctamente");

    const providerToUse = provider || contract.provider;

    if (providerToUse && typeof providerToUse.on === "function") {
      providerToUse.on("error", (error) => {
        console.log("🔌 Error de blockchain:", error.message);
        isListening = false;
      });

      providerToUse.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          console.log("🔄 Cambio de red detectado:", {
            anterior: oldNetwork.name,
            nueva: newNetwork.name,
          });
        }
      });

      console.log("✅ Listeners de eventos de provider configurados");
    } else {
      console.log("⚠️ Provider no disponible para listeners de eventos");
    }
  } catch (error) {
    console.error(
      "❌ Error al iniciar listeners de blockchain:",
      error.message
    );
    console.error("🔧 Stack trace:", error.stack);
    isListening = false;
  }
};

const stopBlockchainListeners = () => {
  if (!isListening) {
    console.log("⚠️ No hay listeners activos para detener");
    return;
  }

  try {
    const { contract } = require("../config/ethers");

    if (!contract) {
      console.error("❌ No se puede detener listeners: contrato no disponible");
      return;
    }

    eventListeners.forEach(({ name }) => {
      contract.removeAllListeners(name);
      console.log(`🛑 Listener '${name}' detenido`);
    });

    eventListeners = [];
    isListening = false;
    console.log("🛑 Todos los listeners de blockchain han sido detenidos");
  } catch (error) {
    console.error("❌ Error al detener listeners:", error.message);
  }
};

const getListenerStatus = () => ({
  isListening,
  activeListeners: eventListeners.length,
  listenerNames: eventListeners.map((l) => l.name),
});

module.exports = {
  startBlockchainListeners,
  stopBlockchainListeners,
  getListenerStatus,
};
