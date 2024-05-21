import { Router } from "express";
import { AppRequest, AppResponse } from "~/core/controllerBase";
import logManager from "~/managers/logManager"
import path from "path"
;
class AdminController {
    private readonly Route = Router();
    constructor() {
        this.Route.get("/", this.init);
        this.Route.get("/login")
    }

    private init(_req: AppRequest, res: AppResponse) {
        logManager.info("AdminController", "default init route requested",);
        res.json({ message: "Default init route" });
    }
    private loginPage(_req: AppRequest, res: AppResponse) {
        res.sendFile(path.join(__dirname, '/views/login.html'));
    }
    public get Router() {
        return this.Route;
    }
}
export default new AdminController();