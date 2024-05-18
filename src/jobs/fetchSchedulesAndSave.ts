import schedule from 'node-schedule'
import { IPoolService } from '../api/Ipool/IpoolService'
import { writeToDatabase } from '../database'
import { getWeek, startOfWeek } from 'date-fns'
import Skola24Client from '../api/Skola24/api/Skola24Client'
import { Skola24Service } from '../api/Skola24/Skola24Service'

export const fetchSchedulesAndSave = async () => // export is temp
{
    const ipoolService = new IPoolService()
    const skola24Service = new Skola24Service()

    const oneWeekAfter = new Date()
    oneWeekAfter.setDate(new Date().getDate() + 7)

    const twoWeeksAfter = new Date()
    twoWeeksAfter.setDate(new Date().getDate() + 14)

    let ipoolEvents = await ipoolService.getSchedule(startOfWeek(new Date(), { weekStartsOn: 1 }), twoWeeksAfter)

    let skola24EventsCurrentWeek = await skola24Service.getSchedule(getWeek(new Date()))
    let skola24EventsNextWeek = await skola24Service.getSchedule(getWeek(oneWeekAfter))
    let skola24EventsTwoWeek = await skola24Service.getSchedule(getWeek(twoWeeksAfter))

    writeToDatabase(ipoolEvents.concat(skola24EventsCurrentWeek, skola24EventsNextWeek, skola24EventsTwoWeek))

}

const fetchSchedulesAndSaveJob = schedule.scheduleJob("0 0 * * *", fetchSchedulesAndSave)

export default fetchSchedulesAndSaveJob