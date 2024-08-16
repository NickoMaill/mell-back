import { BaseModel } from '~/core/typeCore';

export class DataText extends BaseModel {
    public type: string;
    public description: string;
    public code: string;
    public sortOrder: string;
}
