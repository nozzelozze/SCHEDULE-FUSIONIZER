import schedule from 'node-schedule'
import { IPoolService } from '../api/Ipool/IpoolService'

export const fetchSchedules = () => // export is temp
{
    const ipoolService = new IPoolService()

    const twoWeeksAfter = new Date()
    twoWeeksAfter.setDate(new Date().getDate() + 14)
    
    let ipoolEvents = ipoolService.getSchedule(new Date(), twoWeeksAfter)
    
}

const job = schedule.scheduleJob("0 0 * * *", fetchSchedules)

export default job