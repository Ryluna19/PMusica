const mongodb = require("mongoose");
mongodb.set("strictQuery" , true);
const conectToDb = async () => {
    await mongodb.connect( process.env.DB_URI,

        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

    ).then(() => {
        console.log("Mongo db conectado com sucesso!");
    }).catch((err) => console.log(err));
};


module.exports = conectToDb;
