require("dotenv").config();

const express = require("express");
const path = require("path");

const connectToDatabase = require("./database/db");
const Music = require("./model/Music");

function getPlaylistOptions(songs) {
    const playlists = songs.map((song) => song.playlist || "Geral");

    return [...new Set(["Geral", ...playlists])].sort((a, b) =>
        a.localeCompare(b)
    );
}

// Monta os dados das playlists para exibir na sidebar da home
function getPlaylistData(songs) {
    const playlistMap = new Map();

    const songsFromOldest = [...songs].reverse();

    songsFromOldest.forEach((song) => {
        const playlistName = song.playlist || "Geral";

        if (!playlistMap.has(playlistName)) {
            playlistMap.set(playlistName, {
                name: playlistName,
                count: 0,
                coverImage: song.linkImage
            });
        }
    });

    songs.forEach((song) => {
        const playlistName = song.playlist || "Geral";
        const playlistInfo = playlistMap.get(playlistName);

        if (playlistInfo) {
            playlistInfo.count += 1;
        }
    });

    return [...playlistMap.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
    );
}

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.get("/", async (req, res) => {
    try {
        const playlist = await Music.find().sort({ createdAt: -1 });
        const playlistOptions = getPlaylistOptions(playlist);
        const playlistData = getPlaylistData(playlist);

        res.render("index", {
            playlist,
            playlistOptions,
            playlistData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar a playlist.");
    }
});

app.get("/admin", async (req, res) => {
    try {
        const playlist = await Music.find().sort({ createdAt: -1 });
        const playlistOptions = getPlaylistOptions(playlist);



        res.render("admin", {
            playlist,
            playlistOptions,
            music: null,
            musicDel: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar o painel admin.");
    }
});

app.post("/create", async (req, res) => {
    try {
        const { name, author, playlist, linkImage, linkMusic } = req.body;

        if (!name || !author || !linkImage || !linkMusic) {
            return res.status(400).send("Preencha todos os campos.");
        }

        await Music.create({
            name,
            author,
            playlist: playlist || "Geral",
            linkImage,
            linkMusic
        });

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar música.");
    }
});

app.get("/by/:id/:action", async (req, res) => {
    try {
        const { id, action } = req.params;

        const music = await Music.findById(id);
        const playlist = await Music.find().sort({ createdAt: -1 });
        const playlistOptions = getPlaylistOptions(playlist);

        if (!music) {
            return res.redirect("/admin");
        }

        if (action === "edit") {
            return res.render("admin", {
                playlist,
                playlistOptions,
                music,
                musicDel: null
            });
        }

        return res.render("admin", {
            playlist,
            playlistOptions,
            music: null,
            musicDel: music
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar música.");
    }
});

app.post("/update/:id", async (req, res) => {
    try {
        const { name, author, playlist, linkImage, linkMusic } = req.body;

        if (!name || !author || !linkImage || !linkMusic) {
            return res.status(400).send("Preencha todos os campos.");
        }

        await Music.findByIdAndUpdate(req.params.id, {
            name,
            author,
            playlist: playlist || "Geral",
            linkImage,
            linkMusic
        });

        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao atualizar música.");
    }
});

app.post("/delete/:id", async (req, res) => {
    try {
        await Music.findByIdAndDelete(req.params.id);

        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao deletar música.");
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});