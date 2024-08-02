import { DataBaseAppError, DatabaseCore } from "~/core/dataBaseCore";
import Table from "./table";
import { Media, MediaPayloadType } from "~/models/media";
import { UserAccessLevel } from "~/core/typeCore";
import { ApiTable, QuerySearch } from "~/core/coreApiTypes";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinaryModule from "./services/assets/cloudinaryModule";
import { IMediaDto } from "./services/assets/contracts";
import errorHandlers from "~/core/errorHandlers";
import { StandardError } from "~/core/standardError";

class MediaModule extends Table<Media, MediaPayloadType> {
    protected override Table = ApiTable.MEDIAS;
    protected override Level = UserAccessLevel.VISITOR;
    protected override LevelNew = UserAccessLevel.ADMIN;
    protected override LevelUpdate = UserAccessLevel.ADMIN;
    protected override LevelDelete = UserAccessLevel.ADMIN;
    protected override LevelExport = UserAccessLevel.ADMIN;
    protected override SearchContent: QuerySearch<Media>[] = [
        { field: "isVideo", dbField: "isVideo", typeWhere: "EQUALS", typeClause: "EQUALS"},
        { field: "type", dbField: "type", typeWhere: "EQUALS", typeClause: "EQUALS"},
        { field: "mediaGroup", dbField: "mediaGroup", typeWhere: "EQUALS", typeClause: "EQUALS"},
        { field: "mediaGroupId", dbField: "mediaGroupId", typeWhere: "EQUALS", typeClause: "EQUALS"},
    ];
    protected override DefaultSort: keyof Media = "id";
    protected override SqlFields: string[] = Object.keys(new Media());
    protected override EnableFile: boolean = true;

    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    protected override async performNew(): Promise<void> {
        if (!this.Payload.name) {
            this.Payload.name = this.nameGenerator(15);
        }
        console.log(this.Payload.isVideo ? "video" : "image")
        const resourceType = this.Payload.isVideo ? "video" : "image";
        const bufferedImg = this.Request.file?.buffer.toString('base64');
        const uploadOptions: UploadApiOptions = {
            public_id: this.Payload.name,
            resource_type: resourceType,
            allowed_formats: ["png", "mp4", "jpg", "webp"]
        };
        console.log(this.Request.file.mimetype);
        const upload: UploadApiResponse = await cloudinaryModule.uploadAsset(`data:${this.Request.file.mimetype};base64,${bufferedImg}`, uploadOptions);
        const IMediaInfo: IMediaDto = {
            url: upload.secure_url,
            type: upload.format,
            size: upload.bytes,
            width: upload.width,
            height: upload.height,
            isVideo: this.Payload.isVideo,
            externalId: upload.asset_id,
            mediaGroup: this.Payload.mediaGroup,
            mediaGroupId: this.Payload.mediaGroupId
        };

        await this.db.insert(IMediaInfo).catch(async (err: DataBaseAppError) => {
            if (err.code === '23505') {
                await cloudinaryModule.deleteAsset(upload.public_id);
            } else {
                errorHandlers.errorSql('mediaManager.uploadAssets', err);
            }

        });
    }

    protected override async performDelete() {
        const medias = await this.db.getById<Media>(this.Request.params.id);

        if (medias.totalRecords === 0) {
            throw new StandardError('MediaManager.deleteAsset', 'BAD_REQUEST', 'asset_not_found', 'asset not found', `asset with id ${this.Request.params.id} can't be deleted cause not found`);
        }
        await cloudinaryModule.deleteAsset(medias.records[0].externalId);
        await this.db.deleteRecord(this.Request.params.id);
    }

    private nameGenerator(length: number): string {
        let result = '';
        let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;

        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    // private --> end region //////////////////////////////////////////////
}
export default MediaModule;