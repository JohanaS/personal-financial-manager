# 💰 Personal Financial Manager

🔗 **[Ver aplicación en producción](https://personal-financial-manager-xi.vercel.app/)**

Aplicación web full-stack para la gestión de finanzas personales. Permite a los usuarios registrar ingresos y gastos, visualizar su balance, aplicar la regla del presupuesto 50/30/20 y consultar reportes mensuales, todo con persistencia real en base de datos.

---

## 🗺️ Road Map del Proyecto

### Fase 1 — Estructura base
- [x] Inicialización del monorepo con carpetas `backend/` y `frontend/`
- [x] Configuración de Express + MongoDB Atlas en el backend
- [x] Configuración de React + Vite en el frontend
- [x] Variables de entorno con `dotenv` (`MONGO_URI`, `JWT_SECRET`, `PORT`)

### Fase 2 — Autenticación de usuarios
- [x] Modelo `User` en Mongoose (nombre, email, contraseña hasheada con bcrypt)
- [x] Endpoint `POST /api/register` — registro con validación de duplicados
- [x] Endpoint `POST /api/login` — autenticación con JWT
- [x] Persistencia de sesión en `localStorage` (token + datos de usuario)
- [x] Protección de rutas en el frontend: redirige a `/login` si no hay sesión activa
- [x] Mensaje de confirmación al registrar un usuario nuevo

### Fase 3 — Transacciones
- [x] Modelo `Transaction` en Mongoose (usuario, tipo, monto, categoría, método de pago, tarjeta, etiqueta de presupuesto, nota, fecha)
- [x] Endpoint `POST /api/transactions` — creación de transacciones
- [x] Endpoint `GET /api/transactions/user/:id` — consulta de transacciones por usuario
- [x] Formulario de transacciones con validación en el frontend
- [x] Guardado de tarjetas de crédito frecuentes
- [x] Actualización inmediata del estado tras crear una transacción

### Fase 4 — Persistencia y corrección de bugs
- [x] `useEffect` en `App.jsx` para cargar transacciones desde la API al iniciar o refrescar la sesión
- [x] Corrección de URL mismatch entre frontend (`/user/:id`) y backend (`/users/:id`)
- [x] Corrección del filtro de eliminación de transacciones (`_id` vs `id`)

### Fase 5 — Dashboard y visualización
- [x] Tarjetas de resumen: Balance total, Ingresos totales, Gastos totales
- [x] Gráfico de ingresos vs gastos por mes (`IncomeChart`)
- [x] Regla de presupuesto 50/30/20 configurable por el usuario (`BudgetRule`)
- [x] Vista de transacciones con filtros y eliminación

### Fase 6 — Reportes
- [x] Página `/reportes` con resumen mensual de movimientos
- [x] Desglose por categoría y método de pago
- [x] Selector de mes (`MonthCard`)

### Fase 7 — UX / UI
- [x] Modo oscuro / claro con `ThemeContext`
- [x] Diseño responsive (mobile-first)
- [x] Componentes reutilizables: `Header`, `SummaryCard`, `CustomSelect`, `ConfirmDialog`
- [x] Iconografía personalizada (`icons.jsx`)

---

## 🧱 Stack Tecnológico

| Capa       | Tecnología                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite, React Router v7         |
| Backend    | Node.js, Express 5, Mongoose            |
| Base de datos | MongoDB Atlas                        |
| Autenticación | JWT, bcrypt                          |
| Estilos    | CSS modular (BEM), variables CSS        |

---

## 🚀 Inicio rápido

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

> Requiere un archivo `.env` en `backend/` con `MONGO_URI`, `JWT_SECRET` y `PORT`.

---

## 📁 Estructura del proyecto

```
personal-financial-manager/
├── backend/          # API REST con Express + MongoDB
└── frontend/         # SPA con React + Vite
```
