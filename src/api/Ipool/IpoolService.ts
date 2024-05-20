import { start } from "repl";
import { Schedule, Activity } from "../../util/types";
import { Ipool } from "./IpoolClient";
import Colors from "../../util/colors";
import { IPoolConfig } from "../../config/config";



export class IPoolService
{
    
    public getSchedule = async (startDate: Date, endDate: Date, config: IPoolConfig): Promise<Activity[]> =>
    {
        let shiftsApi = new Ipool.ShiftsClient()
        let tokenApi = new Ipool.Client()
        let token = (await tokenApi.token("password", config.username, config.password)).access_token ?? ""

        let activities: Activity[] = []
        
        let shifts = await shiftsApi.loadStaffShiftsV2(
            startDate, 
            endDate, 
            false, 
            undefined, 
            undefined, 
            undefined, 
            token
        )

        shifts.forEach((shift: any) => {
            
            let event: Activity = {
                startTime: new Date(shift["DateFrom"]),
                endTime: new Date(shift["DateTo"]),
                label: `Ica - ${shift["ShortDescription"]}`,
                color: Colors["Red"],
                type: "ipool"
            }
            activities.push(event)
        })

        return activities
    }
}