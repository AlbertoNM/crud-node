# User API – Node.js, Express, Sequelize, JWT

Este proyecto es una API REST básica para gestionar usuarios, implementada con:

- **Express** como framework principal.
- **Sequelize** como ORM para PostgreSQL.
- **JWT** para autenticación.
- **Zod** para validación de entradas.
- **bcrypt** para encriptar contraseñas.

## Estructura del proyecto

```txt
📁 project-root/
├── db.js            # Conexión a la base de datos usando Sequelize
├── schema.js        # Modelo de usuario definido con Sequelize
└── index.js         # Lógica principal de la API con Express
```

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/AlbertoNM/crud-node.git
cd crud-node
```

2. Instala las dependencias:

```bash
npm install
```

## 🚀 Uso

Inicia el servidor:

```bash
node index.js
```

La API se ejecutará en `http://localhost:3000`.

## 🔐 Autenticación

- Utiliza JWT para proteger las rutas.
- Para autenticarte, haz un `POST /login` con `mail` y `password`.
- Recibirás un token que debes enviar en el header:

```bash
Authorization: Bearer <token>
```

## 📌 Endpoints

### Público

- `GET /`  
  Retorna un mensaje básico de bienvenida.

- `POST /login`  
  Autenticación de usuario, devuelve un token si las credenciales son correctas.

### Protegidos (requieren token)

- `GET /users`  
  Lista usuarios con filtros opcionales por nombre o correo.

- `POST /users`  
  Crea un nuevo usuario (nombre, correo, contraseña).

- `GET /users/:id`  
  Obtiene un usuario por ID.

- `PATCH /users/:id`  
  Actualiza los datos del usuario (nombre, mail, password o estado activo).

- `DELETE /users/:id`  
  Elimina un usuario.

## 🧩 Modelo de Usuario

| Campo     | Tipo    | Restricciones                 |
| --------- | ------- | ----------------------------- |
| id        | INTEGER | PK, auto-incremental          |
| name      | STRING  | NOT NULL                      |
| mail      | STRING  | NOT NULL                      |
| password  | STRING  | NOT NULL (hash de contraseña) |
| active    | BOOLEAN | DEFAULT true                  |
| createdAt | DATE    | generado automáticamente      |
| updatedAt | DATE    | generado automáticamente      |

## 🛠 Dependencias principales

- `express`
- `sequelize`
- `pg` y `pg-hstore`
- `dotenv`
- `bcrypt`
- `jsonwebtoken`
- `zod`
