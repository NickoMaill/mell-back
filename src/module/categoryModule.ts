import { ApiTable, DatabaseCoreQuery } from '~/core/coreApiTypes';
import { DatabaseCore } from '~/core/dataBaseCore';
import { Category, CategoryPayload } from '~/models/categories';

class CategoryModule extends DatabaseCore {
    constructor() {
        super(ApiTable.CATEGORIES);
    }

    public async addItem(payload: CategoryPayload) {
        await this.insert<CategoryPayload>(payload);
    }

    public async getCategories(where: DatabaseCoreQuery<Category>) {
        const cats = await this.getByQuery<Category>(where);
        return cats;
    }
}

export default new CategoryModule();
