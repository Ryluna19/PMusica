const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

// Connect application to MongoDB using the DB_URI from .env
async function connectToDatabase() {
  try {
    if (!process.env.DB_URI) {
      throw new Error("DB_URI não foi definida no arquivo .env.");
    }

    await mongoose.connect(process.env.DB_URI);

    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:");
    console.error(error.message);
  }
}

module.exports = connectToDatabase;