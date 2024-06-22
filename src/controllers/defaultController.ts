import logManager from '~/managers/logManager';
import ControllerBase, { AppRequest, AppResponse } from '../core/controllerBase';
import puppeteer from 'puppeteer';
import { CommentPayload } from '~/models/shows';
import showsManager from '~/managers/showsManager';

class DefaultController extends ControllerBase {
    constructor() {
        super();
        this.Route.get('/', this.init);
    }
    private init(_req: AppRequest, res: AppResponse) {
        logManager.setLog('Init Route', 'default init route requested');
        res.json({ message: 'Default init route' });
    }
}

export default new DefaultController();
