import { addWeeks, getDay, isSameWeek, startOfWeek } from "date-fns";
import { Activity, Day } from "./types";


const groupEventsByWeek = (events: Activity[], weekOffset: number = 0): Day[] =>
{
    const currentDate = new Date()
    const targetWeekStart = addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), weekOffset)

    const dayNames = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
    const days: Day[] = dayNames.map(name => ({ name, events: [] }));

    for (const e of events)
    {
        if (isSameWeek(e.startTime, targetWeekStart, { weekStartsOn: 1 }))
        {
            let dayIndex = getDay(e.startTime)
            dayIndex = (dayIndex + 6) % 7;
            days[dayIndex].events.push(e)
        }
    }

    return days
}

export default groupEventsByWeek