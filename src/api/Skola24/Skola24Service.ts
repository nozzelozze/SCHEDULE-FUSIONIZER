import { addDays, parseISO, formatISO, format, startOfWeek } from "date-fns";
import { Activity } from "../../util/types";
import Skola24Client from "./api/Skola24Client";
import Host from "./api/utils/hosts";
import SelectionType from "./api/utils/selectionTypes";
import Colors from "../../util/colors";

export class Skola24Service
{

    public getSchedule = async (week: number): Promise<Activity[]> =>
    {
        const client = new Skola24Client()

        const hostName = process.env.SKOLA24_HOST
        const unitGuid = process.env.SKOLA24_UNITGUID
        const selection = process.env.SKOLA24_SELECTION
        const acceptedLessons = JSON.parse(process.env.SKOLA24_ACCEPTED_LESSONS || "")

        const activeSchoolYearsResponse = await client.getActiveSchoolYears({ hostName: hostName as Host, checkSchoolYearsFeatures: false })
        const year = activeSchoolYearsResponse.data.data.activeSchoolYears[0].guid

        const renderKeyResponse = await client.getTimetableRenderKey({})
        const key = renderKeyResponse.data.data.key

        let renderTimetableResponse = await client.renderTimetable({
            renderKey: key,
            host: hostName as Host,
            unitGuid: unitGuid as string,
            startDate: null,
            endDate: null,
            scheduleDay: 0,
            blackAndWhite: false,
            width: 500,
            height: 500,
            selectionType: SelectionType.Class,
            selection: selection as string,
            showHeader: false,
            periodText: "",
            week: week,
            year: new Date().getFullYear(),
            privateFreeTextMode: null,
            privateSelectionMode: false,
            customerKey: "",
            schoolYear: year
        })

        const activities: Activity[] = []

        const lessonInfo = renderTimetableResponse.data.data.lessonInfo

        lessonInfo.forEach(lesson =>
        {
            let color = ""
            const lessonName = lesson.texts[0]
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
                    color: color
                });
            }
        })
        return activities
    }

}