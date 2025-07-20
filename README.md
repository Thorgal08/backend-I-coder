# E-Commerce Backend

Sistema de e-commerce desarrollado con Node.js, Express y MongoDB. Implementa un backend completo con gestión de productos y carritos, incluyendo paginación, filtros avanzados y interfaz web profesional.

## Características

- **API RESTful** completa para productos y carritos
- **Paginación y filtros** avanzados (categoría, precio, disponibilidad)
- **Interfaz web moderna** con Bootstrap
- **Base de datos MongoDB** con Mongoose
- **Actualizaciones en tiempo real** con Socket.IO
- **Gestión completa de carritos** de compras

## Tecnologías

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Handlebars
- Socket.IO
- Bootstrap 5

## Instalación

1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd backend-I-coder
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
Crear archivo `.env` con:
```
PORT=4000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce
```

4. Ejecutar el servidor
```bash
npm start
```

## Endpoints de la API

### Productos

- `GET /api/products` - Obtener productos con filtros y paginación
  - Query params: `limit`, `page`, `sort`, `category`, `status`
- `GET /api/products/:pid` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:pid` - Actualizar producto
- `DELETE /api/products/:pid` - Eliminar producto
- `GET /api/products/categories` - Obtener categorías disponibles

### Carritos

- `POST /api/carts` - Crear nuevo carrito
- `GET /api/carts/:cid` - Obtener productos del carrito
- `POST /api/carts/:cid/product/:pid` - Agregar producto al carrito
- `PUT /api/carts/:cid` - Actualizar todos los productos del carrito
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad de un producto
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto del carrito
- `DELETE /api/carts/:cid` - Vaciar carrito

## Rutas Web

- `/` - Página principal con lista de productos
- `/products` - Catálogo con filtros y paginación
- `/products/:pid` - Detalle de producto
- `/cart` - Carrito de compras
- `/carts/:cid` - Carrito específico
- `/realtimeproducts` - Gestión administrativa de productos

## Estructura del Proyecto

```
src/
├── app.js                 # Configuración principal del servidor
├── config/
│   └── database.js        # Configuración de MongoDB
├── managers/
│   ├── ProductManagerMongo.js  # Gestión de productos
│   └── CartManagerMongo.js     # Gestión de carritos
├── models/
│   ├── Product.js         # Modelo de producto
│   └── Cart.js           # Modelo de carrito
├── routes/
│   ├── products.router.js # Rutas de productos
│   ├── carts.router.js   # Rutas de carritos
│   └── views.router.js   # Rutas de vistas
├── views/                # Plantillas Handlebars
└── public/               # Archivos estáticos
```

## Funcionalidades

### Gestión de Productos
- CRUD completo de productos
- Filtros por categoría, precio y disponibilidad
- Paginación configurable
- Ordenamiento ascendente/descendente por precio
- Búsqueda por texto en título y descripción

### Gestión de Carritos
- Creación y gestión de carritos
- Agregar/eliminar productos
- Actualizar cantidades
- Populate automático de productos en carritos
- Proceso de checkout completo

### Interfaz Web
- Diseño responsive con Bootstrap
- Filtros interactivos con auto-submit
- Actualizaciones en tiempo real
- Notificaciones toast
- Paginación profesional

## Autor

Proyecto académico desarrollado para el curso de Backend I.
