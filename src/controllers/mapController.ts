import { PhotonMapDetailsType } from './../module/services/map/contracts/photonType';
import { Router } from 'express';
import { AppQuery, AppRequest, AppResponse } from '~/core/controllerBase';
import photonModule from '~/module/services/map/photonModule';

class MapController {
    private readonly Route = Router();
    constructor() {
        this.Route.get('/search', this.getAddress);
    }

    // private --> start region ////////////////////////////////////////////
    private async getAddress(req: AppQuery<{ q: string }>, res: AppResponse<PhotonMapDetailsType[]>) {
        const address = await photonModule.autocomplete(req.query.q);
        res.json(address.features);
    }
    // private --> end region //////////////////////////////////////////////

    // public --> start region /////////////////////////////////////////////
    public get Router() {
        return this.Route;
    }
    // public --> end region ///////////////////////////////////////////////
}
export default new MapController();
