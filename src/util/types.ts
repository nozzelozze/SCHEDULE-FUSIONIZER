
export type Activity =
{
    startTime: Date,
    endTime: Date,
    label: string,
    color?: string,
    type: "skola24" | "ipool"
}

export type Day = 
{
    name: string,
    events: Activity[]
}

export type Schedule =
{
    [date: string]: Activity[]
}