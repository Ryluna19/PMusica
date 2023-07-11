require('dotenv').config();
const express = require('express');
const path = require('path');
const connectToDatabase = require('./database/db');
const Music = require('./model/Music'); 

const app = express();
const port = process.env.PORT || 3000;
let music = null; //quando renderizar vou passar também a música 
let musicDel = null; // crio a variável musicDel como null


app.set("view engine", "ejs");

connectToDatabase();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
//app.use(routes);

/*app.get("/" , (req,res) => {
    res.render("index");
});
*/

app.get("/" , async (req,res) => {
    const playlist = await Music.find();
    console.log(playlist);
    res.render("index" , {playlist})
})

app.get("/admin" , async (req,res) => {
    const playlist = await Music.find();
    res.render("admin", {playlist, music: null, musicDel: null });
});

app.post("/create" , async (req,res) => {
    const music = req.body ; // Envia as informaçoes para o banco
    await Music.create(music); // Grava-se as informaçoes no banco de dados
    res.redirect("/");  // Retorna para a pagina Princiapl ( Index ).
})

app.get("/by/:id/:action" , async (req,res) => {
    const {id, action} = req.params ;
    music = await Music.findById({_id: id});
    const playlist = await Music.find();
    
    if(action == "edit") {
        res.render("admin" , {playlist, music, musicDel: null});
    }else {
        res.render("admin" , {playlist, music: null , musicDel:music });
    }
    
    
})

app.post("/update/:id" , async (req,res) => {
    const newMusic = req.body ;
    await Music.updateOne({_id: req.params.id}, newMusic);
    res.redirect("/admin");
})

app.get("/delete/:id" , async (req,res) => {
    await Music.deleteOne({_id: req.params.id});
    res.redirect("/admin");
})

app.listen(port, () => console.log(`Servidor Rodando em http://localhost:${port}`));