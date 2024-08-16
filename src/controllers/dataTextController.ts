import { DataText } from '~/models/dataText';
import TableController from './tableController';
import { DataTextModule } from '~/module/DataTextModule';

class DataTextController extends TableController<DataText, null> {
    constructor() {
        super(DataTextModule);
    }

    // public --> start region /////////////////////////////////////////////
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new DataTextController();
