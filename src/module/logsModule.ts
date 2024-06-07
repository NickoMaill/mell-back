import { ApiTable, DatabaseCoreQuery } from "~/core/coreApiTypes";
import { DatabaseCore } from "~/core/dataBaseCore";
import { ModuleBase } from "~/core/moduleBase";
import { OutputQueryRequest } from "~/core/typeCore";
import { Log, LogPayload } from "~/models/logs";

class LogsModule extends DatabaseCore implements ModuleBase<Log, LogPayload> {
    constructor(obj: Log) {
        super(ApiTable.LOGS, Object.keys(obj));
    }

    public async getOne(id: number): Promise<OutputQueryRequest<Log>> {
        const log = await this.getById<Log>(id);
        return log;
    }
    public async getAllTable() {
        const logs = await this.getAll<Log>();
        return logs;
    }
    public async getAny (query: DatabaseCoreQuery<Log>): Promise<OutputQueryRequest<Log>> {
        const logs = await this.getByQuery(query);
        return logs;
    }
    public async add(payload: LogPayload): Promise<boolean> {
        await this.insert(payload);
        return true;
    }
}

export default new LogsModule(new Log());