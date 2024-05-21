import { Request, Response, Router } from 'express';

export interface AppRequest<T = any, Y = any> extends Request<any, any, T, Y> {}
export interface AppParams<P = any, T = any> extends Request<P, any, T> {}
export interface AppQuery<T = any> extends Request<any, any, any, T> {}
export interface AppResponse<T = any> extends Response<T> {}

class ControllerBase {
    public _routerInit: Router;

    constructor() {
        this._routerInit = Router();
    }
}

export default ControllerBase;
