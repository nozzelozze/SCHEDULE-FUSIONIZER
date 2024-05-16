import { config } from "dotenv";
import express from "express";

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { schedule: {} });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. http://localhost:${PORT}`);
});
