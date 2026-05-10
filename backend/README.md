# 🖥️ Backend — Personal Financial Manager

API REST construida con **Node.js + Express + MongoDB Atlas**. Gestiona la autenticación de usuarios y las operaciones CRUD de transacciones financieras.

---

## 🛠️ Tecnologías

| Paquete      | Versión  | Propósito                                  |
|--------------|----------|--------------------------------------------|
| Express      | ^5.2     | Framework HTTP                             |
| Mongoose     | ^9.6     | ODM para MongoDB                           |
| bcrypt       | ^6.0     | Hash seguro de contraseñas                 |
| jsonwebtoken | ^9.0     | Generación y verificación de tokens JWT    |
| dotenv       | ^17.4    | Variables de entorno                       |
| cors         | ^2.8     | Habilitación de CORS para el frontend      |
| nodemon      | ^3.1     | Reinicio automático en desarrollo          |

---

## 📁 Estructura

```
backend/
└── src/
    ├── app.js                  # Punto de entrada: Express, CORS, conexión a MongoDB
    ├── controllers/
    │   ├── userController.js       # Registro y login de usuarios
    │   └── transactionController.js # CRUD de transacciones
    ├── models/
    │   ├── user.js                 # Esquema de usuario (nombre, email, password)
    │   └── transaction.js          # Esquema de transacción
    ├── routes/
    │   ├── userRoutes.js           # /api/register, /api/login
    │   └── transactionRoutes.js    # /api/transactions, /api/transactions/user/:id
    ├── middleware/                 # (reservado para auth middleware)
    └── utils/                      # (reservado para helpers)
```

---

## 🔌 Endpoints

### Usuarios

| Método | Ruta           | Descripción                          | Body requerido                      |
|--------|----------------|--------------------------------------|-------------------------------------|
| POST   | `/api/register` | Registra un nuevo usuario            | `{ name, email, password }`         |
| POST   | `/api/login`    | Autentica y devuelve un JWT + usuario | `{ email, password }`               |

### Transacciones

| Método | Ruta                          | Descripción                          | Body / Params                        |
|--------|-------------------------------|--------------------------------------|--------------------------------------|
| POST   | `/api/transactions`            | Crea una nueva transacción           | `{ user, type, amount, category, paymentMethod, ... }` |
| GET    | `/api/transactions/user/:id`   | Obtiene transacciones de un usuario  | Param: `id` (ObjectId del usuario)   |

---

## 🗄️ Modelos

### User
```js
{
  name:     String (required),
  email:    String (required, unique),
  password: String (required, hashed con bcrypt)
}
```

### Transaction
```js
{
  user:          ObjectId → User (required),
  type:          'income' | 'expense' (required),
  amount:        Number (required),
  category:      String (required),
  date:          Date (default: now),
  paymentMethod: 'efectivo' | 'debito' | 'credito' (required),
  cardName:      String,
  budgetTag:     String,
  note:          String
}
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz de `backend/`:

```env
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/<db>
JWT_SECRET=tu_clave_secreta
PORT=3001
```

---

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```
