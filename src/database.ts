import { readFileSync, writeFileSync } from "fs"
import { Activity } from "./util/types"
import { DatabaseConfig } from "./config/config"
import handleError from "./error/handleError"

export const readDatabase = (config: DatabaseConfig): Activity[] =>
{
    try
    {
        const file = readFileSync(config.path, "utf8")
        const data = JSON.parse(file)
        return data as Activity[]
    } catch (error)
    {
        return []
    }
}

export const writeToDatabase = (data: Activity[], config: DatabaseConfig): void =>
{
    try
    {
        writeFileSync(config.path, JSON.stringify(data, null, 2), "utf8")
    } catch (error: any)
    {
        handleError(error)
    }
}