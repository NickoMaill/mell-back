import { Router } from "express";

class ControllerBase {
    private readonly Route = Router();

    // public --> start region /////////////////////////////////////////////
    protected get Router() {
        return this.Route;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default ControllerBase;