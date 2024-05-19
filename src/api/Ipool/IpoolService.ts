import { start } from "repl";
import { Schedule, Activity } from "../../util/types";
import { Ipool } from "./IpoolClient";
import Colors from "../../util/colors";



export class IPoolService
{
    
    public getSchedule = async (startDate: Date, endDate: Date): Promise<Activity[]> =>
    {
        let shiftsApi = new Ipool.ShiftsClient()
        let tokenApi = new Ipool.Client()
        let token = (await tokenApi.token("password", process.env.IPOOL_USERNAME ?? "", process.env.IPOOL_PASSWORD ?? "")).access_token ?? ""

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
                color: Colors["Red"]
            }
            activities.push(event)
        })

        return activities
    }
}