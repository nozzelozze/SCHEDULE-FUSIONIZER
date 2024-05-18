import { config } from "dotenv";
import express from "express";
import { readDatabase } from "./database";
import groupEventsByWeek from "./util/groupEventsByWeek";
import "./jobs/fetchSchedulesAndSave" // Import so it runs
config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", "./views")
app.set("view engine", "pug")

app.use(express.static("public"))

app.get("/", (req, res) =>
{
    res.render("index", { days: groupEventsByWeek(readDatabase()) })
})

app.get("/next", (req, res) =>
{
    res.render("index", { days: groupEventsByWeek(readDatabase(), 1) })
})

app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}. http://localhost:${PORT}`)
})
