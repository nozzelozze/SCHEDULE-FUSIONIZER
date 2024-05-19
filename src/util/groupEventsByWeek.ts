import { addWeeks, getDay, isSameWeek, startOfWeek } from "date-fns";
import { Activity, Day } from "./types";


const groupEventsByWeek = (activites: Activity[], weekOffset: number = 0): Day[] =>
{
    const currentDate = new Date()
    const targetWeekStart = addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), weekOffset)

    const dayNames = ["M", "T", "O", "T", "F", "L", "S"];
    const days: Day[] = dayNames.map(name => ({ name, events: [] }));

    for (const a of activites)
    {
        if (isSameWeek(a.startTime, targetWeekStart, { weekStartsOn: 1 }))
        {
            let dayIndex = getDay(a.startTime)
            dayIndex = (dayIndex + 6) % 7;
            days[dayIndex].events.push(a)
        }
    }

    for (const day of days)
    {
        day.events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }

    return days
}

export default groupEventsByWeek