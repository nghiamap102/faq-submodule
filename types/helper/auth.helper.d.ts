export class AuthHelper {
    static getVDMSToken(): string | undefined;
    static getVDMSHeader(): {
        'Content-Type': string;
        Authorization: string;
    };
    static getVDMSHeaderAuthOnly(): {
        Authorization: string;
    };
    static getCameraSnapShotImageHeader(): {
        Accept: string;
        Authorization: string;
    };
    static getSystemHeader(): {
        'Content-Type': string;
    };
}
//# sourceMappingURL=auth.helper.d.ts.map