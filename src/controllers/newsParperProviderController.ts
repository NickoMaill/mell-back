import { NewsPaperProvider, NewsPaperProviderPayload } from '~/models/articles';
import TableController from './tableController';
import { NewsPaperProviderModule } from '~/module/newsPaperProviderModule';

class NewsParperProviderController extends TableController<NewsPaperProvider, NewsPaperProviderPayload> {
    constructor() {
        super(NewsPaperProviderModule);
    }

    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new NewsParperProviderController();
