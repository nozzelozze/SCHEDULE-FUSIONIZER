import { Schedule, Event } from "../../util/types";
import { Ipool } from "./IpoolClient";



export class IPoolService
{
    
    public getSchedule = async (): Promise<Schedule> =>
    {
        let shiftsApi = new Ipool.ShiftsClient()
        let tokenApi = new Ipool.Client()
        let token = (await tokenApi.token("password", process.env.IPOOL_USERNAME ?? "", process.env.IPOOL_PASSWORD ?? "")).access_token ?? ""

        let schedule: Schedule = {}
        
        let shifts = await shiftsApi.loadStaffShiftsV2(
            new Date("2024-05-1"), 
            new Date("2024-05-31"), 
            false, 
            undefined, 
            undefined, 
            undefined, 
            token
        )

        shifts.forEach((shift: any) => {
            
            let event: Event = {
                startTime: new Date(shift["DateFrom"]),
                endTime: new Date(shift["DateTo"]),
                label: `Ica - ${shift["ShortDescription"]}`
            }

            let date: string = new Date(shift["DateFrom"]).toString()
            let key = schedule[date]

            if (key === undefined)
            {
                schedule[date] = [event]
            } else
            {
                key.push(event)
            }
        })

        return schedule
    }
}