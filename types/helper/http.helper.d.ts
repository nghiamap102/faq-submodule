export default class HttpClient {
    get(url: any, header?: any, cb?: any): Promise<any>;
    getImage(url: any, header?: any, cb?: any): Promise<any>;
    post(url: any, data: any, header?: any, cb?: any): Promise<any>;
    postFile(url: any, formData: any, header?: any, cb?: any): Promise<any>;
    patch(url: any, data: any, header?: any, cb?: any): Promise<any>;
    put(url: any, data: any, header?: any, cb?: any): Promise<any>;
    delete(url: any, data: any, header?: any, cb?: any): Promise<any>;
    checkStatus(response: any): any;
    parseJSON(response: any): any;
    checkError(response: any): any;
}
//# sourceMappingURL=http.helper.d.ts.map