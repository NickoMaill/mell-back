import { Show, ShowPayloadType } from '~/models/shows';
import TableController from './tableController';
import ShowsModule from '~/module/showsModule';
    class ShowsController extends TableController<Show, ShowPayloadType> {
        constructor() {
            super(ShowsModule);
        }
    }

export default new ShowsController()