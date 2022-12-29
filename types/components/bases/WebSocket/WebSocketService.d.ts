export class WebSocketService {
    static init: (options: any) => void;
    static close: () => void;
    static connect: () => void;
    static subscribeChanel(channel: any, listener: any): void;
    static leaveChanel(channel: any, listener: any): void;
    static hasChannel(channel: any): boolean | undefined;
    static sendMessage(channel: any, data: any): void;
    static requestAPI(channel: any, body: any): void;
    static logging: (...args: any[]) => void;
}
//# sourceMappingURL=WebSocketService.d.ts.map