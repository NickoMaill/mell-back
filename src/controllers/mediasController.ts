import { Router } from 'express';

class MediasController {
    private readonly Route = Router();
    constructor() {
        this.Route.get('/');
        this.Route.get('/:id(\\d+)');
    }

    public get Router() {
        return this.Route;
    }
}
export default new MediasController();
