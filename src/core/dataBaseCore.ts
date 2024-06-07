import configManager from '~/managers/configManager';
import { Client, DatabaseError, Pool, QueryResult } from 'pg';
import format from 'pg-format';
import { ApiTable, DatabaseCoreQuery, InsertFormatOut, ParamsType } from '~/core/coreApiTypes';
import { OutputQueryRequest } from './typeCore';
import errorHandlers from './errorHandlers';
import tools from '~/helpers/tools';

export type DataBaseAppError = DatabaseError;

export class DatabaseCore {
    //#region Constructor
    protected readonly core: Pool;
    public client: Client;
    public isConnected: boolean;
    private readonly table: ApiTable;
    private readonly formatter: (sql: string, ...args: any[]) => string;
    private readonly customTableFormater: (sql: string, ...args: any[]) => string;
    private readonly fields: string[] = [];
    constructor(apiTable?: ApiTable, tableFields?: string[]) {
        this.core = new Pool({ ssl: configManager.sslConfig() });
        this.client = new Client();
        this.client.connect()
        .then(res =>{ this.isConnected = true; })
        .catch(err => { this.isConnected = false; });
        this.table = apiTable;
        this.fields = tableFields;
        format.config();
        this.formatter = (sql, ...args) => format(sql, apiTable, ...args);
        this.customTableFormater = (sql, ...args) => format(sql, args[0], apiTable, ...args.slice(1));
    }
    //#endregion

    //#region Protected
    protected async getAll<T>(): Promise<OutputQueryRequest<T>> {
        const result = await this.databaseEngine<T>(this.formatter('SELECT *, count(*) OVER() AS "totalRecords" FROM %I'));
        return this.formatOutputData(result);
    }

    protected async getById<T>(id: number): Promise<OutputQueryRequest<T>> {
        const result = await this.databaseEngine<T>(this.formatter('SELECT *, count(*) OVER() AS "totalRecords" FROM %I WHERE id = $1'), [id]);
        return this.formatOutputData<T>(result);
    }

    protected async getByQuery<T>(query: DatabaseCoreQuery<T>): Promise<OutputQueryRequest<T>> {
        const queryFormat = this.queryString(query);
        const orderMode = query.asc ? 'ASC' : 'DESC';

        if (!query.offset) {
            query.offset = 0;
        }

        if (!query.limit) {
            query.limit = 10;
        }

        let SQLString = this.customTableFormater('SELECT %s FROM %I WHERE %s OFFSET %s LIMIT %s', queryFormat.select, queryFormat.where, query.offset, query.limit);

        if (queryFormat.join.length > 0) {
            SQLString = this.customTableFormater('SELECT %s FROM %I %s WHERE %s OFFSET %s LIMIT %s', queryFormat.select, queryFormat.join, queryFormat.where, query.offset, query.limit);
        }

        if (query.order) {
            SQLString = this.customTableFormater('SELECT %s FROM %I %s WHERE %s ORDER BY %I %s OFFSET %s LIMIT %s', queryFormat.select, queryFormat.join, queryFormat.where, query.order, orderMode, query.offset, query.limit);
        }

        const result = await this.databaseEngine<T>(SQLString, queryFormat.data);
        return this.formatOutputData(result, query.offset, query.limit);
    }

    protected async insert<P>(dataToInsert: P): Promise<boolean> {
        const insertFormat = this.insertFormat<P>(dataToInsert);
        const SQLString = this.formatter('INSERT INTO %I (%s) VALUES (%s)', insertFormat.insert, insertFormat.values);
        await this.databaseEngine(SQLString, insertFormat.data);
        return true;
    }

    protected async updateRecord<T>(where: DatabaseCoreQuery): Promise<boolean> {
        const queryString = this.queryString(where);
        const SQLString = this.formatter('UPDATE %I SET %s WHERE %s', queryString.updateString, queryString.where);
        await this.databaseEngine<T>(SQLString, queryString.data);
        return true;
    }

    protected async deleteRecord(id: number): Promise<boolean> {
        await this.databaseEngine(this.formatter('DELETE FROM %I WHERE id = $1'), [id]);
        return true;
    }

    protected async query<T>(sqlString: string, ...args: any) {
        const queryResult = await this.databaseEngine<T>(sqlString, args);
        return queryResult;
    }
    //#endregion

    //#region Private
    private async databaseEngine<T>(queryString: string, data?: any[]): Promise<QueryResult<T>> {
        try {
            return await this.core.query<T>(queryString, data ? data : null);
        } catch (error) {
            errorHandlers.errorSql('DatabaseCore.DatabaseEngine', error);
        }
    }

    private insertFormat<T>(obj: T): InsertFormatOut {
        const params = Object.keys(obj);
        const dataOutput: any[] = [];

        let i = 0;
        let values = '';

        for (const value in obj) {
            i += 1;
            values += `$${i},`;
            dataOutput.push(obj[value]);
        }

        const formatValues = values.slice(0, -1);
        const output: InsertFormatOut = {
            insert: params.join(','),
            values: formatValues,
            data: dataOutput,
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

        if (query.where.like) {
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
                joinString += `${join.type} JOIN ${join.join} ON ${join.join}.${join.reference} = ${this.table}.${join.target} `;
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

        for (const value in query.where.equals) {
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
            where: formatWhereParams,
            select: selectString,
            data: dataOutput,
            join: joinString,
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

    private formatOutputData<T>(result: QueryResult, offset?: number, limit?: number): OutputQueryRequest<T> {
        const output: any = {
            records: result.rows.map((record: any) => {
                const formattedRecord: any = {};
                for (const key in record) {
                    const foundedField = this.fields.find(f => f.toLowerCase() === key.toLowerCase());
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
