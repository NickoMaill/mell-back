import { CookieOptions } from 'express';
import { machineIdSync } from 'node-machine-id';
import { StringBuilder } from '~/core/appCore';
import { DatabaseCoreQuery, QuerySearch } from '~/core/coreApiTypes';
import configManager from '~/managers/configManager';

class Tools {
    public parseQuery(queries: any): any {
        for (const query in queries) {
            if (queries[query] === '') {
                queries[query] = null;
            }
            if (!isNaN(queries[query]) && queries[query] !== '' && queries[query] !== null) {
                if (queries[query].includes('.')) {
                    queries[query] = parseFloat(queries[query]);
                } else {
                    queries[query] = parseInt(queries[query]);
                }
            }
            if ((queries[query] ?? '').toString().toLowerCase() === 'true' || (queries[query] ?? '').toString().toLowerCase() === 'false') {
                queries[query] = JSON.parse(queries[query]);
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
            domain: 'localhost',
        };
        return options;
    }

    public buildDbQuery<T, Q>(query: Q, queryStruct: QuerySearch<T>[], baseQuery: DatabaseCoreQuery<T>) {
        const getIndex = (field: string) => queryStruct.findIndex((q) => q.field === field);
        const out: DatabaseCoreQuery<T> = { ...baseQuery, where: { ...baseQuery.where } };

        for (const key in query) {
            switch (key.toLowerCase()) {
                case 'sort': {
                    const sorter = (query[key] as string).split(' ');
                    const index = getIndex(sorter[0]);
                    if (index > -1) {
                        out.order = queryStruct[index].dbField;
                        out.asc = sorter[1].toLowerCase() === 'asc';
                    }
                    break;
                }
                case 'limit':
                case 'offset': {
                    const numValue = Number(query[key]);
                    if (!isNaN(numValue)) {
                        out[key as 'limit' | 'offset'] = numValue;
                    }
                    break;
                }
                default: {
                    const fieldIndex = getIndex(key);
                    if (fieldIndex > -1) {
                        const founded = queryStruct[fieldIndex];
                        if (founded.typeWhere === 'LIKE') {
                            if (!out.where.like) {
                                out.where.like = {};
                            }
                            out.where.like[founded.dbField] = [query[key] as string];
                        } else {
                            if (!out.where.equals) {
                                out.where.equals = {};
                            }
                            const values = (query[key] as string).split(',');
                            if (values.length > 1) {
                                out.where.equals[founded.dbField] = values as any;
                            } else {
                                out.where.equals[founded.dbField] = query[key] as any;
                            }
                        }
                    }
                    break;
                }
            }
        }
        return out;
    }

    public mergeObject<T>(from: T, to: any): T {
        for (const key in from) {
            if (Object.keys(to).includes(key)) {
                from[key] = to[key];
            }
        }
        return from;
    }

    public SetGenericActionLog(formField: string[], to: any, from: any = null) {
        const result = new StringBuilder();
        formField.forEach((f) => {
            if (Object.keys(to).includes(f) && (from === null || from[f] !== to[f]) && from !== null) {
                result.append(`${f} : `);
                if (f.toLowerCase() === 'password') {
                    result.append('XXXXXX (XXXXXX)');
                } else {
                    result.append(`${to[f]}`);
                    if (from !== null) result.append(` (${from[f]})`);
                }
            }
        });
        return result.toString();
    }
}

export default new Tools();
