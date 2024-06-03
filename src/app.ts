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

var fs = require("fs")
var http = require("http")
var https = require("https")
var privateKey = fs.readFileSync("sslcert/server.key", "utf8")
var certificate = fs.readFileSync("sslcert/server.crt", "utf8")

var credentials = { key: privateKey, cert: certificate }

const app = express()

app.set("views", "./views")
app.set("view engine", "pug")

app.use(express.static("public"))

console.log("Fetching schedules...")
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

console.log("Starting server...")

var httpServer = http.createServer(app)
var httpsServer = https.createServer(credentials, app)

const port = process.env.PORT || 3000
if (process.env.DEBUG === "true")
{
    console.log(`Server listening at http://localhost:${port}`)
    httpServer.listen(port)
} else
{
    console.log(`Server listening at https://localhost:${port}`)
    httpsServer.listen(port)
}