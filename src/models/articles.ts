import { BaseModel } from '~/core/typeCore';

export class Article extends BaseModel {
    public title: number;
    public newsPaperId: number;
    public description: string;
    public url: string;
    public attachementUrl: string;
    public attachementType: ArticleAttachementTypeEnum;
    public providerName: string;
    public providerImg: string;
}

export type ArticlePayload = {
    title: number;
    newsPaperId: number;
    description: string;
    url: string;
    attachementUrl: string;
    attachementType: ArticleAttachementTypeEnum;
};

export enum ArticleAttachementTypeEnum {
    VIDEO = 0,
    AUDIO = 1,
    YOUTUBE = 2,
}

export class NewsPaperProvider extends BaseModel {
    public name: string;
    public mediaId: number;
}

export type NewsPaperProviderPayload = {
    name: string;
};
