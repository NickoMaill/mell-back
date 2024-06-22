import { Request, Response, Router } from 'express';
import { AppParams, AppQuery, AppRequest, AppResponse } from '~/core/controllerBase';
import { StandardError } from '~/core/standardError';
import { OutputQueryRequest } from '~/core/typeCore';
import Table from '~/module/table';

class GenericController<T, P = any> {
    public router: Router;
    public module: Table<T, P>;
    constructor(module: new () => Table<T, P>) {
        this.module = new module();
        this.router = Router();
        this.router.get('/', this.getAll.bind(this));
        this.router.get('/:id(\\d+)', this.getById.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.put('/:id(\\d+)', this.update.bind(this));
        this.router.delete('/:id(\\d+)', this.delete.bind(this));
    }

    // @AccessLevel(UserAccessLevel.ADMIN)
    protected async getAll(req: AppQuery, res: AppResponse<OutputQueryRequest<T> | any>) {
        this.module.setRequest(req);
        await this.module.queryAllPublic();
        res.status(200).json(this.module.Data);
    }

    protected async getById(req: AppRequest, res: AppResponse<OutputQueryRequest<T> | any>) {
        this.module.setRequest(req);
        await this.module.queryOnePublic();
        res.status(200).json(this.module.Data);
    }

    protected async create(req: AppRequest<P>, res: AppResponse<{ success: boolean } | any>) {
        this.module.setRequest(req);
        await this.module.performNewPublic();
        res.status(201).json({ success: true });
    }

    protected async update(req: AppRequest<P>, res: AppResponse<{ success: boolean } | any>) {
        this.module.setRequest(req);
        await this.module.performUpdatePublic();
        res.status(200).json({ success: true });
    }

    protected async delete(req: AppParams<{ id: number }>, res: AppResponse<{ success: boolean } | any>) {
        this.module.setRequest(req);
        await this.module.performDeletePublic();
        res.status(200).json({ success: true });
    }
}

export default GenericController;
