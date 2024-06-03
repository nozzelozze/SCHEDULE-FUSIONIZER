import { addDays, parseISO, formatISO, format, startOfWeek } from "date-fns";
import { Activity } from "../../util/types";
import { Skola24Client, Host, SelectionType } from "skola24-node";
import Colors from "../../util/colors";
import { Skola24Config } from "../../config/config";

export class Skola24Service
{

    public getSchedule = async (week: number, config: Skola24Config): Promise<Activity[]> =>
    {
        const client = new Skola24Client({Host: config.host as Host, UnitGuid: config.unitguid})

        const selection = config.selection
        const acceptedLessons = config.accepted_lessons

        let renderTimetableResponse = await client.Timetable.renderTimetable({
            scheduleDay: 0,
            selectionType: SelectionType.Class,
            selection: selection as string,
            week: week,
            year: new Date().getFullYear(),
        })

        const activities: Activity[] = []

        const lessonInfo = renderTimetableResponse.lessonInfo
        
        if (lessonInfo == null) // no school this week
        {
            return []
        }

        lessonInfo.forEach(lesson =>
        {
            let color = ""
            const lessonName = lesson.texts[0] + " " + lesson.texts[2]
            let lessonIsAccepted = lesson.texts.some(text => 
                text.toLowerCase().split(" ").some(word => {
                    if (Object.keys(acceptedLessons).includes(word))
                    {
                        color = Colors[acceptedLessons[word] as keyof typeof Colors]
                        return true
                    }
                    return false
                })
            )
            if (lessonIsAccepted)
            {
                const dayOfWeek = lesson.dayOfWeekNumber;
                const currentYear = new Date().getFullYear();
                const startOfYear = new Date(currentYear, 0, 1);
                const startOfCurrentWeek = addDays(startOfWeek(startOfYear, { weekStartsOn: 1 }), (week - 1) * 7);
                const lessonDate = addDays(startOfCurrentWeek, dayOfWeek - 1);

                const startTime = parseISO(`${format(lessonDate, "yyyy-MM-dd")}T${lesson.timeStart}`);
                const endTime = parseISO(`${format(lessonDate, "yyyy-MM-dd")}T${lesson.timeEnd}`);

                activities.push({
                    startTime,
                    endTime,
                    label: lessonName,
                    color: color,
                    type: "skola24"
                });
            }
        })
        return activities
    }

}