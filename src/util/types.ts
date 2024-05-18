
export type Activity =
{
    startTime: Date,
    endTime: Date,
    label: string
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