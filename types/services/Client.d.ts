export default class Client {
    get(query: any, params: any, cb: any): Promise<any>;
    post(query: any, data: any, cb: any): Promise<any>;
    checkStatus(response: any): any;
    parseJSON(response: any): any;
    checkError(response: any): any;
}
//# sourceMappingURL=Client.d.ts.map