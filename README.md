# 🌱 Sustainable Actions Backend

Un backend para registrar y gestionar acciones sostenibles en blockchain y base de datos PostgreSQL. Este proyecto permite a los usuarios registrar acciones ecológicas que quedan inmutablemente almacenadas en la blockchain de Ethereum.

## 🚀 Características

- **Registro de acciones sostenibles** en blockchain (Ethereum/Sepolia)
- **Base de datos PostgreSQL** para almacenamiento eficiente
- **API RESTful** con documentación Swagger
- **Integración con contratos inteligentes** usando ethers.js
- **CORS habilitado** para aplicaciones frontend
- **Documentación automática** de la API

## 🛠️ Tecnologías Utilizadas

- **Node.js** con Express.js
- **PostgreSQL** como base de datos
- **Ethers.js** para interacción con blockchain
- **Swagger** para documentación de API
- **dotenv** para gestión de variables de entorno
- **CORS** para políticas de origen cruzado

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [PostgreSQL](https://www.postgresql.org/) (versión 12 o superior)
- [Git](https://git-scm.com/)
- Una wallet de Ethereum con ETH de prueba (para Sepolia testnet)
- Acceso a un proveedor RPC (Alchemy, Infura, etc.)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sustainable-actions-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```bash
# Puerto en el que corre el servidor
PORT=3000

# URL de la base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/sustainable_actions

# URL del nodo RPC (Sepolia testnet recomendado para pruebas)
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/tu_api_key

# Clave privada de la wallet (¡NUNCA compartir en producción!)
PRIVATE_KEY=tu_clave_privada_sin_0x
```

### 4. Configurar la base de datos

Conecta a PostgreSQL y crea la base de datos y tabla:

```sql
-- Crear la base de datos
CREATE DATABASE sustainable_actions;

-- Usar la base de datos
\c sustainable_actions;

-- Crear la tabla de acciones
CREATE TABLE actions (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_user_address ON actions(user_address);
CREATE INDEX idx_timestamp ON actions(timestamp);
```

### 5. Desplegar el contrato inteligente

Antes de usar el backend, necesitas desplegar un contrato inteligente que contenga la función `recordAction(string memory description)`.

Una vez desplegado, actualiza el archivo `contractABI.json` con el ABI de tu contrato y configura la dirección del contrato en `config/ethers.js`.

## 🚀 Uso

### Iniciar el servidor

```bash
# Modo desarrollo (recomendado durante desarrollo)
npm run dev

# O modo producción
npm start
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado en PORT).

### Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación completa de la API en:

```
http://localhost:3000/api-docs
```

## 📡 Endpoints de la API

### 🌱 Registrar una nueva acción sostenible

```http
POST /actions
```

**Cuerpo de la petición:**

```json
{
  "userAddress": "0x742d35Cc63C7B9c1C9E7E8C9F8e9B5a6F7c8D9E0",
  "description": "Planté 5 árboles en el parque local"
}
```

**Respuesta exitosa (201):**

```json
{
  "message": "Acción registrada correctamente en blockchain y base de datos.",
  "blockchainTxHash": "0xabc123...",
  "action": {
    "id": 1,
    "user_address": "0x742d35Cc63C7B9c1C9E7E8C9F8e9B5a6F7c8D9E0",
    "description": "Planté 5 árboles en el parque local",
    "timestamp": "2025-07-16T10:30:00.000Z"
  }
}
```

### 📋 Obtener todas las acciones

```http
GET /actions
```

**Respuesta exitosa (200):**

```json
[
  {
    "id": 1,
    "user_address": "0x742d35Cc63C7B9c1C9E7E8C9F8e9B5a6F7c8D9E0",
    "description": "Planté 5 árboles en el parque local",
    "timestamp": "2025-07-16T10:30:00.000Z"
  }
]
```

### 👤 Obtener acciones por usuario

```http
GET /actions/user/{userAddress}
```

**Ejemplo:**

```http
GET /actions/user/0x742d35Cc63C7B9c1C9E7E8C9F8e9B5a6F7c8D9E0
```

## 🏗️ Estructura del Proyecto

```
sustainable-actions-backend/
├── config/
│   ├── db.js              # Configuración de PostgreSQL
│   ├── ethers.js          # Configuración de blockchain
│   └── swagger.js         # Configuración de Swagger
├── controllers/
│   └── actionsController.js # Lógica de controladores
├── models/
│   └── actionModel.js     # Modelos de datos
├── routes/
│   └── actionsRoutes.js   # Definición de rutas
├── services/
│   ├── blockchainService.js # Servicios de blockchain
│   └── dbService.js       # Servicios de base de datos
├── utils/                 # Utilidades generales
├── contractABI.json       # ABI del contrato inteligente
├── index.js              # Punto de entrada principal
├── package.json          # Dependencias y scripts
├── .env.example          # Ejemplo de variables de entorno
└── README.md            # Este archivo
```

## 🔒 Seguridad

### Variables de entorno

- ❌ **NUNCA** subas el archivo `.env` al repositorio
- ✅ Usa variables de entorno en producción
- ✅ Mantén las claves privadas seguras

### Base de datos

- ✅ Usa conexiones cifradas en producción
- ✅ Implementa validación de entrada
- ✅ Usa prepared statements (ya implementado)

### Blockchain

- ✅ Usa testnet para desarrollo
- ✅ Valida transacciones antes de confirmar
- ✅ Maneja errores de gas adecuadamente

## 🧪 Testing

Para probar la API puedes usar:

### Con curl:

```bash
# Registrar una acción
curl -X POST http://localhost:3000/actions \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x742d35Cc63C7B9c1C9E7E8C9F8e9B5a6F7c8D9E0",
    "description": "Recicle 10 botellas de plástico"
  }'

# Obtener todas las acciones
curl http://localhost:3000/actions

# Obtener acciones por usuario
curl http://localhost:3000/actions/user/0x742d35Cc63C7B9c1C9E7E8C9F8e9B5a6F7c8D9E0
```

### Con Postman:

Importa la documentación desde `http://localhost:3000/api-docs` o usa los endpoints directamente.

## 🚨 Solución de Problemas

### Error de conexión a la base de datos

```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solución:** Verificar que PostgreSQL esté ejecutándose y que la URL de conexión sea correcta.

### Error de conexión a blockchain

```bash
Error: could not detect network
```

**Solución:** Verificar que la RPC_URL sea válida y que tengas conexión a internet.

### Error de clave privada inválida

```bash
Error: invalid private key
```

**Solución:** Asegurar que la PRIVATE_KEY esté en formato correcto (sin prefijo 0x).

### Error de gas insuficiente

```bash
Error: insufficient funds for gas
```

**Solución:** Asegurar que la wallet tenga suficiente ETH para las transacciones.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de la API en `/api-docs`
2. Verifica que todas las variables de entorno estén configuradas
3. Consulta la sección de solución de problemas
4. Abre un issue en el repositorio

---

🌱 **¡Juntos por un futuro más sostenible!** 🌱
