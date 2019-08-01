/**
 * 解析http(s)链接的正则
 */
export const hrefReg: RegExp = /^(https?\:\/\/|\/\/)([^:/?#]+)(:?\d*)(\/?[^?#]*)(\??[^#]*)(#?.*)$/;
/**
 * 用来处理http或https链接，获取或修改其中的值
 */
export class Href {
    /**完整链接 */
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
    private getHrefRegMatch(): RegExpMatchArray {
        return this.absUrl.match(hrefReg);
    }
    /**
     * 获取protocol协议
     * @returns 获取协议字符串，如 http、https；当链接中没有协议以//开头时，将返回undefined
     */
    getProtocol(): string {
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
    getHostname(): string {
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
    getPort(): string {
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
    getPath(): string {
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
    getQueryString(): string {
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
    getHash(): string {
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
}

