import configManager from '~/managers/configManager';
import cloudinary, { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { StandardError } from '~/core/standardError';

class CloudinaryModule {
    protected readonly _client: typeof cloudinary.v2.uploader;
    constructor() {
        cloudinary.v2.config({
            cloud_name: configManager.getConfig.CLOUDINARY_CLOUDNAME,
            api_key: configManager.getConfig.CLOUDINARY_APIKEY,
            api_secret: configManager.getConfig.CLOUDINARY_SECRET,
        });
        this._client = cloudinary.v2.uploader;
    }

    public async uploadAsset(imagePath: string, data: UploadApiOptions): Promise<UploadApiResponse> {
        const upload = await this._client.upload(imagePath, data, (err, _res) => {
            if (err) {
                throw new StandardError('cloudinaryModule.uploadAsset', 'BAD_REQUEST', 'error_happened', 'upload error happened', `${JSON.stringify(err)}`);
            }
        });

        return upload;
    }

    public async deleteAsset(providerId: string): Promise<boolean> {
        const del = await this._client.destroy(providerId).catch((err) => {
            if (err) {
                throw new StandardError('', 'BAD_REQUEST', 'error_happened', 'an error happened');
            }
        });

        if (del.result === 'not found') {
            throw new StandardError('CloudinaryModule.deleteAsset', 'FATAL', 'no_provider_asset', 'asset not found');
        }

        return true;
    }
}

export default new CloudinaryModule();