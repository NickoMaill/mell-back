import { Request, Response, Router } from 'express';

export interface AppRequest<T = any, Y = any> extends Request<any, any, T, Y> {}
export interface AppParams<P = any, T = any> extends Request<P, any, T> {}
export interface AppQuery<T = any> extends Request<any, any, any, T> {}
export interface AppResponse<T = any> extends Response<T> {}

class ControllerBase {
    protected readonly Route = Router();

    // public --> start region /////////////////////////////////////////////
    public get Router() {
        return this.Route;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default ControllerBase;
