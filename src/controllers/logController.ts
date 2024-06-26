import { Log } from "~/models/logs";
import TableController from "./tableController";
import LogsModule from "~/module/logsModule";
import { AppParams, AppRequest, AppResponse } from "~/core/controllerBase";
import { StandardError } from "~/core/standardError";

class LogController extends TableController<Log, null> {
    constructor() {
        super(LogsModule);
    }
    protected override update(req: AppRequest<null, any>, res: AppResponse<any>): Promise<void> {
        throw new StandardError("logController.create", "UNAUTHORIZED", "unauthorized", "unauthorized route", "unauthorized route")
    }
    protected override create(req: AppRequest<null, any>, res: AppResponse<any>): Promise<void> {
        throw new StandardError("logController.create", "UNAUTHORIZED", "unauthorized", "unauthorized route", "unauthorized route")
    }
    protected override delete(req: AppParams<{ id: number; }, any>, res: AppResponse<any>): Promise<void> {
        throw new StandardError("logController.create", "UNAUTHORIZED", "unauthorized", "unauthorized route", "unauthorized route")
    }
}

export default new LogController();