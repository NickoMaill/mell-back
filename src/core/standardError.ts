// =================================================================================== //
// this is a prebuild StandardError object.                                            //
// Invoke this tool when you want to catch a server error.                             //
// =================================================================================== //

import { v4 as uuid } from 'uuid';
import logManager from '~/managers/logManager';

export type ErrorStatusType = 'FATAL' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'BAD_REQUEST' | 'NOT_FOUND' | 'UNAVAILABLE';

export class StandardError<T extends any = {}> extends Error {
    private _id: string;
    private _key: string;
    private _status: ErrorStatusType;
    private _errorCode: string;
    private _message: string;
    private _detailedMessage: string | null = null;
    private _log: boolean;
    private _data: T | null = null;

    public get status() {
        return this._status;
    }

    public get errorCode() {
        return this._errorCode;
    }

    public get message() {
        return this._message;
    }

    public get key() {
        return this._key;
    }

    public get id() {
        return this._id;
    }

    public get detailedMessage() {
        return this._detailedMessage;
    }

    public get log() {
        return this._log;
    }

    public get data() {
        return this._data;
    }

    constructor(key: string, status: ErrorStatusType, errorCode: string, message: string, detailedMessage: string | null = null, log: boolean = false, data: T | null = null) {
        super(message);

        this._key = key;
        this._id = uuid();
        this._status = status;
        this._errorCode = errorCode;
        this._message = message;
        this._log = log;

        if (detailedMessage) this._detailedMessage = detailedMessage;

        if (data) this._data = data;
        if (this._log) logManager.setLog("", `Message :<br/>&emsp;&emsp;${message}${detailedMessage && detailedMessage !== "" ? `<br/><br/>Details :<br/>&emsp;&emsp;${detailedMessage}` : ""}`, key)
    }
}
