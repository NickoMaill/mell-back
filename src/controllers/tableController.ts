import { Router } from 'express';
import multer, { Multer } from 'multer';
import { AppParams, AppQuery, AppRequest, AppResponse } from '~/core/controllerBase';
import { OutputQueryRequest } from '~/core/typeCore';
import tools from '~/helpers/tools';
import { checkAuth } from '~/middlewares/auth';
import Table from '~/module/table';

class TableController<T, P extends any> {
    public router: Router;
    public module: Table<T, P>;
    private upload: Multer;
    constructor(module: new () => Table<T, P>) {
        this.module = new module();
        if (this.module.IsFileEnable) {
            this.upload = multer();
        }
        this.router = Router();
        this.router.get('/', (req, res, next) => checkAuth(req, res, next, this.module.publicLevel), this.getAll.bind(this));
        this.router.get('/:id(\\d+)', (req, res, next) => checkAuth(req, res, next, this.module.publicLevel), this.getById.bind(this));
        this.router.post('/', (req, res, next) => checkAuth(req, res, next, this.module.publicLevelNew), (this.module.IsFileEnable ? this.upload.single('file') : (_res, _req, next) => next()), this.create.bind(this));
        this.router.put('/:id(\\d+)', (req, res, next) => checkAuth(req, res, next, this.module.publicLevelUpdate), (this.module.IsFileEnable ? this.upload.single('file') : (_res, _req, next) => next()), this.update.bind(this));
        this.router.delete('/:id(\\d+)', (req, res, next) => checkAuth(req, res, next, this.module.publicLevelDelete), this.delete.bind(this));
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
        this.module.setPayload(tools.parseQuery(req.body));
        await this.module.performNewPublic();
        res.status(201).json({ success: true });
    }

    protected async update(req: AppRequest<P>, res: AppResponse<{ success: boolean } | any>) {
        this.module.setRequest(req);
        this.module.setPayload(tools.parseQuery(req.body));
        await this.module.performUpdatePublic();
        res.status(200).json({ success: true });
    }

    protected async delete(req: AppParams<{ id: number }>, res: AppResponse<{ success: boolean } | any>) {
        this.module.setRequest(req);
        await this.module.performDeletePublic();
        res.status(200).json({ success: true });
    }
}

export default TableController;
