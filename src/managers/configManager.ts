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
            SHOW_ERROR_DETAILS: process.env.SHOW_ERROR_DETAILS === "true",
            SECRET_REFRESH: process.env.APP_REFRESH_SECRET,
            ACCESS_SECRET: process.env.APP_ACCESS_SECRET,
            BREVO_APIKEY: process.env.APP_BREVO_APIKEY,
            BREVO_LIST_ID: process.env.APP_BREVO_LIST_ID,
            BREVO_ORDER_TEMPLATE_ID: process.env.APP_BREVO_ORDER_TEMPLATE_ID,
            BREVO_SENDER: process.env.APP_BREVO_SENDER,
            BREVO_USER_MAIL: process.env.APP_BREVO_USER_MAIL,
            FRONT_BASEURL: process.env.APP_FRONT_BASEURL,
            API_BASEURL: process.env.APP_API_BASEURL,
            HTTPS: process.env.HTTPS === "true"
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
