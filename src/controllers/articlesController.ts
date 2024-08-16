import TableController from './tableController';
import { ArticlePayload, Article } from '~/models/articles';
import { ArticleModule } from '~/module/articleModule';

class ArticlesController extends TableController<Article, ArticlePayload> {
    constructor() {
        super(ArticleModule);
    }

    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new ArticlesController();
