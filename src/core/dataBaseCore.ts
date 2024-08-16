import configManager from '~/managers/configManager';
import { Client, DatabaseError, Pool, PoolClient, QueryResult } from 'pg';
import format from 'pg-format';
import { ApiTable, DatabaseCoreQuery, InsertFormatOut, ParamsType } from '~/core/coreApiTypes';
import { OutputQueryRequest } from './typeCore';
import errorHandlers from './errorHandlers';
import { StandardError } from './standardError';

export type DataBaseAppError = DatabaseError;

export class DatabaseCore {
    //#region Constructor
    public readonly core: Pool;
    public isConnected: boolean = true;
    private readonly table: ApiTable;
    private readonly formatter: (sql: string, ...args: any[]) => string;
    private readonly customTableFormater: (sql: string, ...args: any[]) => string;
    private readonly fields: string[] = [];
    protected queryObj: DatabaseCoreQuery = {};
    constructor(apiTable?: ApiTable, tableFields?: string[]) {
        this.core = new Pool({
            ssl: configManager.sslConfig(),
            connectionTimeoutMillis: 2000,
            idleTimeoutMillis: 30000,
            max: 20,
            allowExitOnIdle: true,
        });
        this.table = apiTable;
        this.fields = tableFields;
        format.config();
        this.formatter = (sql, ...args) => format(sql, apiTable, ...args);
        this.customTableFormater = (sql, ...args) => format(sql, args[0], apiTable, ...args.slice(1));
    }
    //#endregion
    //#region Protected
    public async getAll<T>(): Promise<OutputQueryRequest<T>> {
        const result = await this.databaseEngine<T>(this.formatter('SELECT *, count(*) OVER() AS "totalRecords" FROM %I'));
        return this.formatOutputData(result);
    }

    public async getById<T>(id: number): Promise<OutputQueryRequest<T>> {
        const result = await this.databaseEngine<T>(this.formatter('SELECT *, count(*) OVER() AS "totalRecords" FROM %I WHERE id = $1'), [id]);
        return this.formatOutputData<T>(result);
    }

    public getClient() {
        return new Client();
    }

    public async getByQuery<T>(query: DatabaseCoreQuery<T>): Promise<OutputQueryRequest<T>> {
        const queryFormat = this.queryString(query);
        const orderMode = query.asc ? 'ASC' : 'DESC';
        const args = [];
        if (!query.offset) {
            query.offset = 0;
        }

        if (!query.limit) {
            query.limit = 10;
        }
        let baseSql = 'SELECT %s FROM %I';
        args.push(queryFormat.select);
        if (queryFormat.join.length > 0) {
            baseSql += ' %s';
            args.push(queryFormat.join);
        }
        if (queryFormat.where.length > 0) {
            baseSql += ' WHERE %s';
            args.push(queryFormat.where);
        }
        if (query.order) {
            baseSql += ' ORDER BY %I %s';
            args.push(query.order.toString().toLowerCase(), orderMode);
        }
        baseSql += ' OFFSET %s LIMIT %s';
        console.log(baseSql);
        args.push(query.offset, query.limit);
        console.log(args);
        let SQLString = this.customTableFormater(baseSql, ...args);
        console.log(SQLString);
        const result = await this.databaseEngine<T>(SQLString, queryFormat.data);
        return this.formatOutputData(result, query.offset, query.limit);
    }

    /**
     *
     * @param dataToInsert Payload to insert
     * @param uniq uniq fields to check before insert
     * @returns
     */
    public async insert<P, T = any>(dataToInsert: P, uniq?: (keyof P)[]): Promise<OutputQueryRequest<T>> {
        const insertFormat = this.insertFormat<P>(dataToInsert, uniq);
        let SQLString = this.formatter('INSERT INTO %I (%s) VALUES (%s) RETURNING *', insertFormat.insert, insertFormat.values);

        if (uniq && uniq.length > 0) {
            SQLString = this.formatter('INSERT INTO %I (%s) SELECT %s WHERE NOT EXISTS (SELECT 1 FROM %I WHERE %s) RETURNING *', insertFormat.insert, insertFormat.values, this.table, insertFormat.uniq);
        }
        const inserted = await this.databaseEngine<T>(SQLString, insertFormat.data);
        return this.formatOutputData(inserted);
    }

    public async updateRecord<T>(where: DatabaseCoreQuery): Promise<boolean> {
        const queryString = this.queryString(where);
        const SQLString = this.formatter('UPDATE %I SET %s WHERE %s', queryString.updateString, queryString.where);
        console.log(SQLString);
        await this.databaseEngine<T>(SQLString, queryString.data);
        return true;
    }

    public async deleteRecord(id: number): Promise<boolean> {
        await this.databaseEngine(this.formatter('DELETE FROM %I WHERE id = $1'), [id]);
        return true;
    }

    public async query<T>(sqlString: string, ...args: any) {
        const queryResult = await this.databaseEngine<T>(sqlString, args);
        return queryResult;
    }
    public async disconnectAll() {
        await this.core.end();
    }
    public async ping(): Promise<void> {
        try {
            await this.core.connect();
            await this.query('SELECT 1');
            console.log(`Connected to DB ${this.getClient().database ?? ''} ✅`);
            await this.core.end();
            return;
        } catch (err) {
            throw new StandardError('db.ping', 'FATAL', 'no_db', 'unable connect to db', err.message, err);
        }
    }
    //#endregion

    //#region Private
    private async databaseEngine<T>(queryString: string, data?: any[]): Promise<QueryResult<T>> {
        try {
            const out = await this.core.query<T>(queryString, data ? data : null);
            return out;
        } catch (error) {
            errorHandlers.errorSql('DatabaseCore.DatabaseEngine', error);
        }
    }

    private insertFormat<T>(obj: T, uniq?: (keyof T)[]): InsertFormatOut {
        const params = Object.keys(obj);
        const dataOutput: any[] = [];

        let i = 0;
        let values = '';
        let uniqClause = '';

        for (const value in obj) {
            i += 1;
            values += `$${i},`;
            dataOutput.push(obj[value]);
        }

        if (uniq && uniq.length > 0) {
            uniq.forEach((u) => {
                i += 1;
                if (uniqClause.length > 0) uniqClause += ' AND ';
                uniqClause += `${u as string} = $${i}`;
                dataOutput.push(obj[u]);
            });
        }

        const formatValues = values.slice(0, -1);
        const output: InsertFormatOut = {
            insert: params.join(','),
            values: formatValues,
            data: dataOutput,
            uniq: uniqClause,
        };

        return output;
    }

    private queryString(query: DatabaseCoreQuery): ParamsType {
        let updateString = '';
        let whereString = '';
        let selectString = '';
        let joinString = '';
        // const joinAlias = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

        let i = 0;
        const dataOutput: any[] = [];

        if (query.where?.like) {
            for (const key in query.where.like) {
                const like = query.where.like[key];
                like.forEach((l, i2) => {
                    i++;
                    whereString += `${like.length > 1 ? '(' : ''}LOWER(${key}) LIKE LOWER($${i}) ${i2 === like.length - 1 && like.length > 1 ? ') AND ' : ' OR '}`;
                    dataOutput.push('%' + l + '%');
                });
            }
        }

        if (query.update) {
            for (const value in query.update) {
                i++;
                updateString += `${value} = $${i},`;
                dataOutput.push(query.update[value]);
            }
        }

        if (query.join) {
            query.join.forEach((join) => {
                // const alias = joinAlias[index];
                joinString += `${join.type} JOIN ${join.join} ON ${join.join}.${join.reference} = ${join.joinTarget ? join.joinTarget : this.table}.${join.target} `;
            });
        }

        if (query.select) {
            query.select.forEach((element) => {
                selectString += `${String(element)},`;
            });
            selectString += 'count(*) OVER() AS "totalRecords"';
        } else {
            selectString = '*, count(*) OVER() AS "totalRecords"';
        }

        for (const value in query.where?.equals) {
            i++;
            if (Array.isArray(query.where[value])) {
                whereString += `${value} IN (${query.where.equals[value].join(',')}) AND `;
            } else {
                whereString += `${value} = $${i} AND `;
                dataOutput.push(query.where.equals[value]);
            }
        }

        const formatParams = updateString.slice(0, -1);
        const formatWhereParams = whereString.slice(0, -5);
        const output: ParamsType = {
            updateString: formatParams,
            where: formatWhereParams.trim(),
            select: selectString.trim(),
            data: dataOutput,
            join: joinString.trim(),
        };
        return output;
    }

    private filterArray(array: any[]) {
        const filteredArray = array.filter((element) => {
            if (element) {
                return true;
            }
            return false;
        });
        return filteredArray;
    }

    public formatOutputData<T>(result: QueryResult, offset?: number, limit?: number): OutputQueryRequest<T> {
        const output: any = {
            records: result.rows.map((record: any) => {
                const formattedRecord: any = {};
                for (const key in record) {
                    const foundedField = this.fields.find((f) => f.toLowerCase() === key.toLowerCase());
                    if (foundedField) {
                        formattedRecord[foundedField] = record[key];
                    }
                }
                return formattedRecord;
            }),
            totalRecords: 0,
        };

        if (result.rowCount === 0) {
            output.message = 'records not founds';
        } else {
            output.totalRecords = parseInt(result.rows[0].totalRecords);
            output.offset = offset;
            output.limit = limit;
        }
        output.records.forEach((records) => {
            delete records.totalRecords;
        });
        return output;
    }
    //#endregion
}
