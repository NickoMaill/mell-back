import fetch from 'node-fetch';
import configManager from '~/managers/configManager';
import { PhotonMapType } from './contracts/photonType';

class PhotonModule {
    constructor() {}

    // public --> start region /////////////////////////////////////////////
    public async autocomplete(query: string): Promise<PhotonMapType> {
        const request = await fetch(`${configManager.getConfig.PHOTON_BASEURL}?q=${query}`);
        const result = await request.json();
        return result as PhotonMapType;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new PhotonModule();
