
export type Activity =
{
    startTime: Date,
    endTime: Date,
    label: string
}

export type Day = {

    events: Activity[]
}

export type Schedule =
{
    [date: string]: Activity[]
}