import schedule from 'node-schedule'
import { IPoolService } from '../api/Ipool/IpoolService'
import { writeToDatabase } from '../database'
import { getWeek, startOfWeek } from 'date-fns'
import { Skola24Service } from '../api/Skola24/Skola24Service'
import { Activity } from '../util/types'
import configHandler, { Config } from '../config/config'

export const fetchSchedulesAndSave = async () => // export is temp
{
    const ipoolService = new IPoolService()
    const skola24Service = new Skola24Service()

    const oneWeekAfter = new Date()
    oneWeekAfter.setDate(new Date().getDate() + 7)

    const twoWeeksAfter = new Date()
    twoWeeksAfter.setDate(new Date().getDate() + 14)

    
    Object.values(configHandler.configs).forEach(async (config: Config) => {
        let activities: Activity[] = []
        if (config.skola24.use)
        {
            let skola24ActivitiesCurrentWeek = await skola24Service.getSchedule(getWeek(new Date(), {weekStartsOn: 1}), config.skola24)
            let skola24ActivitiesNextWeek = await skola24Service.getSchedule(getWeek(oneWeekAfter, {weekStartsOn: 1}), config.skola24)
            let skola24ActivitiesTwoWeek = await skola24Service.getSchedule(getWeek(twoWeeksAfter, {weekStartsOn: 1}), config.skola24)
            activities = [...activities, ...skola24ActivitiesCurrentWeek, ...skola24ActivitiesNextWeek, ...skola24ActivitiesTwoWeek]
        }
        if (config.ipool.use)
        {
            let ipoolActivities = await ipoolService.getSchedule(startOfWeek(new Date(), { weekStartsOn: 1 }), twoWeeksAfter, config.ipool)
            activities = [...activities, ...ipoolActivities]
        }
        writeToDatabase(activities, config.database)
    })

}

const fetchSchedulesAndSaveJob = schedule.scheduleJob("0 0 * * *", fetchSchedulesAndSave)

export default fetchSchedulesAndSaveJob