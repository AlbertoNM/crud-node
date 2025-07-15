import { DataTypes } from "sequelize"; // Importa tipos de datos de Sequelize
import { sequelize } from "./db.js"; // Importa la instancia de conexión a la base de datos

// Define el modelo User con sus campos y propiedades
export const User = sequelize.define(
  "User", // Nombre del modelo
  {
    id: {
      type: DataTypes.INTEGER, // Tipo entero
      primaryKey: true,        // Clave primaria
      autoIncrement: true,     // Autoincremental
    },
    name: {
      type: DataTypes.STRING,  // Cadena de texto
      allowNull: false         // No permite nulos
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,  // Booleano (activo/inactivo)
      defaultValue: true,       // Valor por defecto: true
    },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

await sequelize.sync({ alter: true }); // Sincroniza el modelo con la base de datos, alterando tablas si es necesario
