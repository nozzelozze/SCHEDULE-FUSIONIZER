
export type Event =
{
    startTime: Date,
    endTime: Date,
    label: string
}

export type Schedule =
{
    [date: string]: Event[]
}