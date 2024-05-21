import { DatabaseCoreQuery } from '~/core/coreApiTypes';
import { Category } from '~/models/categories';
import { Movie } from '~/models/movies';
import categoryModule from '~/module/categoryModule';
import moviesModule from '~/module/moviesModule';

class MovieManager {
    constructor() {}

    // public --> start region /////////////////////////////////////////////
    public async getMovie(id: number) {
        const movie = await moviesModule.getOne(id);
        if (movie.totalRecords > 0) {
            const cateQuery: DatabaseCoreQuery<Category> = {
                where: { equals: { movieId: id } },
            };
            const category = await categoryModule.getCategories(cateQuery);
            movie.records[0].categories = category.records;
        }
        return movie;
    }

    public async getAnyMovies(params: any) {
        const query: DatabaseCoreQuery<Movie> = { where: { like: {}, equals: {} } };
        for (const key in params) {
            if (key === 'search') {
                query.where.like.title = [params[key]];
            } else {
                query.where.equals[key] = params[key];
            }
        }
        console.log(query.where.like.title);
        const movies = await moviesModule.getAny(query);
        return movies;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new MovieManager();
