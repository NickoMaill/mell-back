import { Show, ShowPayloadType } from '~/models/shows';
import GenericController from './tableController';
import ShowsModule from '~/module/showsModule';
    class ShowsController extends GenericController<Show, ShowPayloadType> {
        constructor() {
            super(ShowsModule);
        }
    }

export default new ShowsController()