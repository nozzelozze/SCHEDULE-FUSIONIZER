import { config } from "dotenv";
config();
import express, { NextFunction, Request, Response } from "express";
import { readDatabase } from "./database";
import groupEventsByWeek from "./util/groupEventsByWeek";
import "./jobs/fetchSchedulesAndSave" // Import so it runs
import { fetchSchedulesAndSave } from "./jobs/fetchSchedulesAndSave";
import { getWeek } from "date-fns";
import configManager from "./config/config";
import checkValidConfig from "./util/getValidConfig";

const app = express();
const PORT = 3000;

app.set("views", "./views")
app.set("view engine", "pug")

app.use(express.static("public"))

fetchSchedulesAndSave()

app.get("/", (req, res) => 
{
    res.status(404).send("Not Found")
})

app.get("/:config/:next?", checkValidConfig, (req, res) =>
{
    const { config, next } = req.params
    let weekNumber = getWeek(new Date(), { weekStartsOn: 1 })

    let nextWeek = false
    if (next === "next")
    {
        nextWeek = true
        weekNumber += 1
    }

    res.render("index", {
        days: groupEventsByWeek(readDatabase(configManager.configs[config].database), next === "next" ? 1 : 0),
        weekNumber: weekNumber,
        nextWeek: nextWeek
    })
})
app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}. http://localhost:${PORT}`)
})
