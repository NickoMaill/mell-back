import { CookieOptions } from "express";
import { machineIdSync } from "node-machine-id";
import configManager from "~/managers/configManager";

class Tools {
    public parseQuery(queries: any): any {
        for (const query in queries) {
            if (!isNaN(queries[query])) {
                if (queries[query].includes('.')) {
                    queries[query] = parseFloat(queries[query]);
                } else {
                    queries[query] = parseInt(queries[query]);
                }
            }
            if (queries[query] === ('true' || 'false')) {
                queries[query] = Boolean(queries[query]);
            }
        }
        return queries;
    }
    public insertAt(array: any[], index: number, ...elementsArray: any[]) {
        array.splice(index, 0, ...elementsArray);
    }

    public Capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public TimeConvert(value: number): { sec: number; min: number; hour: number; day: number } {
        return {
            sec: value * 1000,
            min: value * 60 * 1000,
            hour: value * 60 * 60 * 1000,
            day: value * 24 * 60 * 60 * 1000,
        };
    }
    public generateOtp(): string {
        const minCeiled = Math.ceil(100000);
        const maxFloored = Math.floor(999999);
        const opt = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled).toString();
        return opt;
    }

    public getDeviceId() {
        const id = machineIdSync(true);
        return id;
    }

    public getCookieOptions(expires: Date): CookieOptions {
        const options: CookieOptions = {
            expires,
            httpOnly: true,
            secure: configManager.getConfig.HTTPS,
            sameSite: 'strict',
            domain: "localhost"
        };
        return options;
    }
}

export default new Tools();
