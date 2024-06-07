import { DatabaseCoreQuery } from '~/core/coreApiTypes';
import { Show } from '~/models/shows';
import categoryModule from '~/module/categoryModule';
import moviesModule from '~/module/moviesModule';

class ShowManager {
    constructor() {}

    // public --> start region /////////////////////////////////////////////
    public async getShow(id: number) {
        const movie = await moviesModule.getOne(id);
        return movie;
    }

    public async getAnyMovies(params: any) {
        const query: DatabaseCoreQuery<Show> = { where: { like: {}, equals: {} } };
        for (const key in params) {
            if (key === 'search') {
                query.where.like.title = [params[key]];
            } else {
                query.where.equals[key] = params[key];
            }
        }
        const movies = await moviesModule.getAny(query);
        return movies;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new ShowManager();
