import { QueryResult } from 'pg';
import { DatabaseCore } from './dataBaseCore';
import { ApiTable } from './coreApiTypes';

class App {
    public static async query(sql: string, ...args: any[]): Promise<QueryResult> {
        const db = new DatabaseCore(ApiTable.LOGS, []);
        return await db.query(sql, ...args);
    }
}

export default App;

export class StringBuilder {
    private parts: string[];
    constructor() {
        this.parts = [];
    }

    public append(part: string) {
        this.parts.push(part);
        return this;
    }

    public toString() {
        return this.parts.join('');
    }
    public clear() {
        this.parts = [];
        return this;
    }
}
