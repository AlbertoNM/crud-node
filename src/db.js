import { Sequelize } from "sequelize"; // Importa Sequelize
import "dotenv/config"; // Carga variables de entorno desde un archivo .env

// Crea una instancia de conexión a la base de datos postgres usando la URL en la variable de entorno DB_URL
export const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres", // Especifica que el motor de base de datos es postgres
  logging: false, // Desactiva el logeo de las consultas SQL en consola
});
