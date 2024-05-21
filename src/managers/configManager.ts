import fs from 'fs';
import dotenv from 'dotenv';
import { IConfigEnv } from '../data/contracts/config';

class ConfigManager {
    private readonly __env: IConfigEnv;

    constructor() {
        dotenv.config({
            path: this.configEnvFile,
        });
        this.__env = {
            NODE_ENV: process.env.NODE_ENV,
            SHOW_ERROR_DETAILS: Boolean(process.env.SHOW_ERROR_DETAILS),
        };
    }

    public get configEnvFile(): string {
        if (process.env.NODE_ENV === 'development') {
            if (fs.existsSync('.env.development.local')) {
                return '.env.development.local';
            } else {
                return '.env.development';
            }
        } else {
            return '.env';
        }
    }

    public get getConfig() {
        return this.__env;
    }

    public get configAsNumber() {
        const res: IConfigEnv = {};
        for (const key in this.__env) {
            const parsed = parseInt(this.__env[key], 10);
            res[key] = isNaN(parsed) || key === 'PGPORT' ? this.__env[key] : parsed;
        }
        return res;
    }

    public sslConfig(): boolean | { rejectUnauthorized: boolean } {
        if (process.env.NODE_ENV === 'development') {
            return false;
        } else {
            return { rejectUnauthorized: false };
        }
    }

    public isProduction() {
        if (this.__env.NODE_ENV === 'production') {
            return true;
        } else {
            return false;
        }
    }
}

export default new ConfigManager();
