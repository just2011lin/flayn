import { IStrObj, IQueryData } from './types';

/**
 * 解析http(s)链接的正则
 */
export const hrefReg: RegExp = /^(https?\:\/\/|\/\/)([^:/?#]+)(:?\d*)(\/?[^?#]*)(\??[^#]*)(#?.*)$/;
/**
 * 用来处理http或https链接，获取或修改其中的值
 */
export class Href {
    /**
     * 完整链接
     */
    private absUrl: string;
    /**
     * 构造函数
     * @param absUrl 完整的http或https链接，可以是没有协议以//开头的链接
     */
    constructor(absUrl: string) {
        this.absUrl = encodeURI(absUrl);
        if (hrefReg.test(this.absUrl) === false) {
            throw new Error(`调用类Href的构造函数时传入的参数不符合http(s)链接格式，请使用正则表达式${String(hrefReg)}验证`);
        }
    }
    /**
     * 获取protocol协议
     * @returns 获取协议字符串，如 http、https；当链接中没有协议以//开头时，将返回undefined
     */
    public getProtocol(): string {
        const regExpMatchArray = this.getHrefRegMatch();
        let protocol: string;
        let httpMatch: RegExpMatchArray;
        const httpReg = /^https?/;
        if (regExpMatchArray) {
            httpMatch = regExpMatchArray[1].match(httpReg);
            if (httpMatch) {
                protocol = httpMatch[0];
            }
        }
        return protocol;
    }
    /**
     * 获取hostname域名
     * @returns 如 www.baidu.com、localhost、192.168.0.14
     */
    public getHostname(): string {
        const regExpMatchArray = this.getHrefRegMatch();
        let hostname: string;
        if (regExpMatchArray) {
            hostname = regExpMatchArray[2];
        }
        return hostname;
    }
    /**
     * 获取port端口号
     * @returns 没有端口号时返回undefined，有端口号时返回端口号，如 8000
     */
    public getPort(): string {
        const regExpMatchArray = this.getHrefRegMatch();
        let port: string;
        let portRegExpMatchArray: RegExpMatchArray;
        if (regExpMatchArray) {
            portRegExpMatchArray = regExpMatchArray[3].match(/\d+/);
            if (portRegExpMatchArray) {
                port = portRegExpMatchArray[0];
            }
        }
        return port;
    }
    /**
     * 获取路径path，链接中域名端口号后、查询字符串前的部分
     * @returns 如 /index.html、github本人地址的路径为/just2011lin；当链接中没有路径部分时，返回空字符；只有/时，返回/
     */
    public getPath(): string {
        const regExpMatchArray = this.getHrefRegMatch();
        let path: string;
        if (regExpMatchArray) {
            path = regExpMatchArray[4];
        }
        return path;
    }
    /**
     * 获取查询字符串queryString
     * @returns 如 resid=abc&page=Edit&wd=what，q=
     */
    public getQueryString(): string {
        const regExpMatchArray = this.getHrefRegMatch();
        let queryString: string;
        let queryStringRegExpMatchArray: RegExpMatchArray;
        if (regExpMatchArray) {
            queryStringRegExpMatchArray = regExpMatchArray[5].match(/[^?]+/);
            if (queryStringRegExpMatchArray) {
                queryString = decodeURIComponent(queryStringRegExpMatchArray[0]);
            }
        }
        return queryString;
    }
    /**
     * 获取hash部分值
     * @returns hash部分值
     */
    public getHash(): string {
        const regExpMatchArray = this.getHrefRegMatch();
        let hash: string;
        let hashRegExpMatchArray: RegExpMatchArray;
        if (regExpMatchArray) {
            hashRegExpMatchArray = regExpMatchArray[6].match(/[^#]+/);
            if (hashRegExpMatchArray) {
                hash = hashRegExpMatchArray[0];
            }
        }
        return hash;
    }
    private getHrefRegMatch(): RegExpMatchArray {
        return this.absUrl.match(hrefReg);
    }
}
/**
 * 解析查询字符串
 * @param queryString 参数字符串（默认为当前链接中的）
 * @returns 解析的结果
 */
export function parseQueryString(queryString: string): IQueryData {
    // 解析查询字符串后的值
    const queryData: IQueryData = {};
    // 对传入的查询字符串进行URI编码并用&分隔符分割成数组
    const tupleArr = queryString.split('&');
    // 设置变量，tuple为：[queryKey, queryValue]
    let tuple: [string, string];
    let queryKey: string;
    let queryValue: string;
    // searchValue为queryData当中相应queryKey的值
    let searchValue: string | string[];
    for (const tupleStr of tupleArr) {
        // 获取到[queryKey, queryValue]形式的tuple值
        tuple = tupleStr.split('=') as [string, string];
        queryKey = decodeURIComponent(tuple[0]);
        queryValue = decodeURIComponent(tuple[1]);
        // 获取queryData中queryKey对应的值
        searchValue = queryData[queryKey];
        // 如果queryKey和queryValue同时存在，则需要将queryKey和queryValue放到queryData中
        if (queryKey && queryValue) {
            if (typeof searchValue === 'undefined') {
                // 如果没有searchValue，将queryValue赋值给queryData
                queryData[queryKey] = queryValue;
            } else if (typeof searchValue === 'string') {
                // 已经有字符串的searchValue了，则将searchValue和queryValue都给queryData
                queryData[queryKey] = [searchValue, queryValue];
            } else if (Array.isArray(searchValue)) {
                // 如果searchValue是一个数组，则将queryValue添加到数组中
                searchValue.push(queryValue);
            }
        }
    }
    return queryData;
}
/**
 * 将查询对象转化成查询字符串，该操作不对key和值进行encodeURIComponent
 */
export function stringifyQueryData(queryData: IQueryData): string {
    const queryStrings: string[] = [];
    let tupleStr: string;
    let searchData: string | string[];
    let tupleStrs: string[];
    Object.keys(queryData).forEach((queryKey) => {
        searchData = queryData[queryKey];
        if (typeof searchData === 'string') {
            tupleStr = `${queryKey}=${searchData}`;
        } else if (Array.isArray(searchData)) {
            tupleStrs = [];
            for (const queryValue of searchData) {
                if (queryValue) {
                    tupleStrs.push(`${queryKey}=${queryValue}`);
                }
            }
            tupleStr = tupleStrs.join('&');
        }
        if (tupleStr) {
            queryStrings.push(tupleStr);
        }
    });
    return queryStrings.join('&');
}
