import { readFileSync, writeFileSync } from "fs"
import { Activity } from "./util/types"

const DATABASE_PATH = "database/database.json"


export const readDatabase = (): Activity[] =>
{
    try
    {
        const file = readFileSync(DATABASE_PATH, "utf8")
        const data = JSON.parse(file)
        console.log("Data successfully read")
        return data as Activity[]
    } catch (error)
    {
        console.log("An error has occurred ", error)
        return []
    }
}

export const writeToDatabase = (data: Activity[]): void =>
{
    try
    {
        writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2), "utf8")
        console.log("Data successfully saved to disk")
    } catch (error)
    {
        console.log("An error has occurred ", error)
    }
}