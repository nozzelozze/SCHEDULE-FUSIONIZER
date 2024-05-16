import { config } from "dotenv";
import express from "express";
import { fetchSchedules } from "./jobs/job";
import { Day, Activity } from "./util/types";
import { addWeeks, getDay, isSameWeek, startOfWeek } from "date-fns";
import { readDatabase } from "./database";
config();

const app = express();
const PORT = process.env.PORT || 3000;

//fetchSchedules() // On startup

app.set("views", "./views")
app.set("view engine", "pug")

app.use(express.static("public"))

export function groupEventsByWeek(events: Activity[], weekOffset: number = 0): Day[] {
    const currentDate = new Date()
    const targetWeekStart = addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), weekOffset)

    const days: Day[] = Array.from({ length: 7 }, () => ({ events: [] }))

    for (const e of events)
    {
        if (isSameWeek(e.startTime, targetWeekStart, { weekStartsOn: 1 }))
        {
            const dayIndex = getDay(e.startTime)
            days[dayIndex].events.push(e)
        }
    }

    return days
}

app.get("/", (req, res) => {
    res.render("index", { days: groupEventsByWeek(readDatabase())})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. http://localhost:${PORT}`)
})
