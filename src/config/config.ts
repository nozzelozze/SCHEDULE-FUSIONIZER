import * as fs from 'fs';
import * as ini from 'ini';
import handleError from '../error/handleError';

export interface IPoolConfig
{
    use: boolean
    username: string
    password: string
}

export interface Skola24Config
{
    use: boolean
    host: string
    unitguid: string
    selection: string
    accepted_lessons: Record<string, string>
}

export interface DatabaseConfig
{
    path: string
}

export interface Config
{
    ipool: IPoolConfig
    skola24: Skola24Config
    database: DatabaseConfig
}

function loadConfig(configPath: string): Config | null
{

    if (fs.existsSync(configPath))
    {
        const configData = fs.readFileSync(configPath, "utf-8")
        const config = ini.parse(configData) as Config
        return config
    } else
    {
        handleError(`Configuration file ${configPath} not found`)
        return null
    }
}

export class ConfigManager
{
    public configs: Record<string, Config>;

    constructor()
    {
        this.configs = {};
        this.loadConfigs();
    }

    private loadConfigs(): void
    {
        const configPathsEnv = process.env.CONFIG_PATHS
        const configPaths: Record<string, string> = JSON.parse(configPathsEnv ?? "{}")

        for (const [key, path] of Object.entries(configPaths))
        {
            let config = loadConfig(path)
            if (config)
                this.configs[key] = config
        }
    }
}

const configManager = new ConfigManager()
export default configManager