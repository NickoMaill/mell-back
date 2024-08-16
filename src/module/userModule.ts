import moment from 'moment';
import { ApiTable, DatabaseCoreQuery } from '~/core/coreApiTypes';
import { DatabaseCore } from '~/core/dataBaseCore';
import Ses from '~/core/ses';
import { TokenPayload, UserToken, User } from '~/models/users';

class UserModule extends DatabaseCore {
    constructor(obj: User) {
        super(ApiTable.USERS, Object.keys(obj));
    }

    // public --> start region /////////////////////////////////////////////
    public async getOneByEmail(email: string): Promise<User> {
        const query: DatabaseCoreQuery<User> = {
            where: {
                equals: { email },
            },
        };
        const response = await this.getByQuery(query);
        if (response.totalRecords !== 1) {
            return null;
        } else {
            return response.records[0];
        }
    }
    public async getOneById(id: number): Promise<User> {
        const user = await this.getById<User>(id);
        if (user.totalRecords !== 1) return null;
        return user.records[0];
    }
    public async InsertToken(payload: TokenPayload): Promise<boolean> {
        const fields = Object.keys(payload);
        const args = fields.map((_f, i) => `$${i + 1}`);
        const data = fields.map((f) => payload[f]);
        const sql = `INSERT INTO Tokens (${fields.join(',')}) VALUES (${args.join(',')})`;
        await this.query(sql, ...data);
        return true;
    }

    public async getTokenInfo(token: string) {
        const record = await this.query<UserToken>('SELECT * FROM Tokens WHERE token = $1', token);
        if (record.rowCount !== 1) {
            return null;
        }
        return record.rows[0];
    }

    public async isDeviceAuthorized(deviceId: string, userId: number): Promise<boolean> {
        const token = await this.query<UserToken>('SELECT * FROM Tokens WHERE userId = $1 AND deviceId = $2 AND isDeviceAuthorized = true', userId, deviceId);
        if (token.rowCount < 1) {
            return false;
        }
        return true;
    }

    public async getLastOtp(): Promise<UserToken> {
        const ses = Ses.getInstance();
        const otp = await this.query<UserToken>("SELECT * FROM Tokens WHERE userId = $1 AND DeviceId = $2 AND type = 'otp' ORDER BY EXPIRES DESC LIMIT 1", ses.UID, ses.DeviceId);
        if (otp.rowCount === 0) return null;
        return otp.rows[0];
    }

    public async getToken(token: string): Promise<UserToken> {
        const tokenData = await this.query<UserToken>('SELECT * FROM Tokens WHERE token = $1 ORDER BY AddedAt DESC LIMIT 1', token);
        if (tokenData.rowCount === 0) return null;
        return tokenData.rows[0];
    }
    public async refreshOtp(id: number): Promise<boolean> {
        await this.query('UPDATE Tokens SET lastOtp = CURRENT_TIMESTAMP WHERE id = $1', id);
        return true;
    }
    public async updateOtp(otp: string, id: number): Promise<boolean> {
        const query: DatabaseCoreQuery<User> = {
            where: {
                equals: {
                    id,
                },
            },
            update: {
                lastOtp: otp,
            },
        };
        await this.updateRecord(query);
        return true;
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new UserModule(new User());
