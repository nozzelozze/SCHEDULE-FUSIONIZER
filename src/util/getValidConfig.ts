import { NextFunction, Request, Response } from "express"
import configManager from "../config/config"


function checkValidConfig(req: Request, res: Response, next: NextFunction)
{
    const { config } = req.params

    if (Object.keys(configManager.configs).includes(config))
    {
        next()
    } else
    {
        res.status(404).send("Not Found")
    }
}

export default checkValidConfig