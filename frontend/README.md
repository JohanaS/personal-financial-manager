# 🎨 Frontend — Personal Financial Manager

Interfaz de usuario construida con **React 19 + Vite**. SPA (Single Page Application) con enrutamiento del lado del cliente, modo oscuro, gráficos y gestión de estado local.

---

## 🛠️ Tecnologías

| Paquete          | Versión | Propósito                                  |
|------------------|---------|--------------------------------------------|
| React            | ^19.2   | UI declarativa basada en componentes       |
| Vite             | ^8.0    | Bundler y servidor de desarrollo           |
| React Router DOM | ^7.15   | Enrutamiento client-side                   |
| Lucide React     | ^1.14   | Librería de iconos                         |
| ESLint           | ^10.2   | Linting y calidad de código                |

---

## 📁 Estructura

```
frontend/src/
├── App.jsx                 # Raíz: rutas, estado global, fetch inicial de transacciones
├── main.jsx                # Punto de entrada React
├── index.css               # Reset y variables CSS globales
├── assets/                 # Imágenes y recursos estáticos
├── blocks/                 # Estilos CSS por módulo (BEM)
│   ├── dashboard.css
│   ├── login.css
│   ├── transactions-page.css
│   ├── reports.css
│   ├── header.css
│   ├── form.css
│   ├── modal.css
│   ├── dark-mode.css
│   └── responsive.css
├── components/             # Componentes reutilizables
│   ├── Header.jsx          # Barra superior con usuario y logout
│   ├── SummaryCard.jsx     # Tarjeta de balance/ingreso/gasto
│   ├── TransactionForm.jsx # Formulario de nueva transacción
│   ├── TransactionList.jsx # Lista con opción de eliminar
│   ├── IncomeChart.jsx     # Gráfico de barras mensual
│   ├── BudgetRule.jsx      # Regla 50/30/20 configurable
│   ├── MonthCard.jsx       # Selector de mes para reportes
│   ├── CustomSelect.jsx    # Select accesible personalizado
│   └── ConfirmDialog.jsx   # Diálogo de confirmación de borrado
├── context/
│   └── ThemeContext.jsx    # Modo oscuro / claro (Context API)
├── pages/
│   ├── Login.jsx           # Registro e inicio de sesión
│   ├── Dashboard.jsx       # Vista principal con resumen y gráficos
│   ├── Transactions.jsx    # Listado completo de transacciones
│   └── Reports.jsx         # Reportes mensuales por categoría
└── utils/
    ├── api.js              # Funciones fetch hacia el backend
    ├── auth.js             # Login, registro, logout, localStorage
    ├── function.js         # Helpers de formato y cálculo
    └── icons.jsx           # Componente centralizado de iconos
```

---

## 🗺️ Páginas y rutas

| Ruta              | Componente        | Descripción                                   |
|-------------------|-------------------|-----------------------------------------------|
| `/login`          | `Login.jsx`       | Registro e inicio de sesión                   |
| `/`               | `Dashboard.jsx`   | Resumen financiero, gráfico y regla de ahorro |
| `/transacciones`  | `Transactions.jsx`| Listado y eliminación de transacciones        |
| `/reportes`       | `Reports.jsx`     | Reportes mensuales detallados                 |

> Rutas protegidas: si no hay sesión activa, todas redirigen a `/login`.

---

## 🔄 Flujo de datos

1. Al montar la app, `App.jsx` lee el usuario de `localStorage`.
2. Si hay sesión activa, un `useEffect` llama a `getTransactions(user.id)` y carga las transacciones desde la API.
3. Al crear una transacción, el backend responde con el objeto guardado y se antepone al estado local (sin refetch).
4. Al eliminar, se filtra el estado por `_id`.
5. El estado de `transactions`, `user` y `budgetRule` vive en `App.jsx` y se pasa por props a todas las páginas.

---

## 🌙 Modo oscuro

Activado con `ThemeContext`. Aplica la clase `dark` al `<body>` y cambia las variables CSS definidas en `blocks/dark-mode.css`.

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz de `frontend/`:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

