import { AppQuery, AppRequest, AppResponse } from '~/core/controllerBase';
import logManager from '~/managers/logManager';
import TableController from './tableController';
import { Media, MediaPayloadType } from '~/models/media';
import MediaModule from '~/module/mediaModule';

class MediasController extends TableController<Media, MediaPayloadType> {
    constructor() {
        super(MediaModule);
        this.router.get('/', this.init);
    }
    private init(_req: AppRequest, res: AppResponse) {
        logManager.setLog('Medias', 'default init route requested');
        res.json({ message: 'Default init route' });
    }
}
export default new MediasController();
