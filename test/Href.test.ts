import { expect } from 'chai';
import 'mocha';
import { hrefReg, Href, parseQueryString, stringifyQueryData } from '../src/Href';
import { IQueryData } from '../src/types';

describe('常量hrefReg是一个检验和匹配http(s)链接的正则表达式', () => {
    it('是http(?)链接检验', () => {
        const href = 'https://onedrive.live.com/redir?resid=abc&page=Edit&wd=what#hash';
        expect(hrefReg.test(href)).to.equal(true);
    });
    it('不是http(?)链接检验', () => {
        const wrongHref = 'fjfla?jqljeq=jfdsuoq';
        expect(hrefReg.test(wrongHref)).to.equal(false);
    });
});

describe('类Href用来获取http(s)链接的内容', () => {
    it('构建一个Href并传入一个http(s)链接', () => {
        const href = 'https://onedrive.live.com/redir?resid=abc&page=Edit&wd=what#hash';
        expect(new Href(href) instanceof Href).to.equal(true);
    });
    it('构建一个Href实例并传入一个不正确的链接', () => {
        const wrongHref = 'fjfla?jqljeq=jfdsuoq';
        try {
            const hrefInstance = new Href(wrongHref);
        } catch (error) {
            expect(error instanceof Error).to.equal(true);
        }
    });
    it('通过类Href的实例方法getProtocol获取连接中的协议内容', () => {
        const href = 'https://onedrive.live.com/redir?resid=abc&page=Edit&wd=what#hash';
        expect(new Href(href).getProtocol()).to.equal('https');
    });
    it('当链接是以//开头的时候，getProtocol方法将返回一个undefined', () => {
        const href = '//onedrive.live.com/redir?resid=abc&page=Edit&wd=what#hash';
        expect(new Href(href).getProtocol()).to.equal(undefined);
    });
    it('通过实例方法getHostname获取链接中的域名部分', () => {
        const href = 'https://onedrive.live.com/redir?resid=abc&page=Edit&wd=what#hash';
        expect(new Href(href).getHostname()).to.equal('onedrive.live.com');
    });
    it('获取localhost这样的域名', () => {
        const href = 'http://localhost:4200/dashboard?a=b&c=d#e';
        expect(new Href(href).getHostname()).to.equal('localhost');
    });
    it('获取ip组成的域名', () => {
        const href = 'http://127.0.0.1:4200/dashboard?a=b&c=d#e';
        expect(new Href(href).getHostname()).to.equal('127.0.0.1');
    });
    it('通过实例方法getPort获取端口号', () => {
        const href = 'http://localhost:4200/dashboard?a=b&c=d#e';
        expect(new Href(href).getPort()).to.equal('4200');
    });
    it('当没有端口号时，获取undefined', () => {
        const href = 'https://onedrive.live.com/redir?resid=abc&page=Edit&wd=what#hash';
        expect(new Href(href).getPort()).to.equal(undefined);
    });
    it('通过实例方法getPath获取路径', () => {
        const href = 'http://localhost:4200/dashboard?a=b&c=d#e';
        expect(new Href(href).getPath()).to.equal('/dashboard');
    });
    it('当没有路径时，将获取一个空字符串', () => {
        const href = 'https://www.baidu.com?q=123';
        expect(new Href(href).getPath()).to.equal('');
    });
    it('当路径仅为/时，将返回/', () => {
        const href = 'https://www.baidu.com/?q=123';
        expect(new Href(href).getPath()).to.equal('/');
    });
    it('通过实例方法getQueryString获取链接中查询字符串的内容', () => {
        const href = 'https://onedrive.live.com/redir?resid=abc&page=Edit&wd=what#hash';
        expect(new Href(href).getQueryString()).to.equal('resid=abc&page=Edit&wd=what');
    });
    it('链接中没有查询字符串时，将返回undefined', () => {
        const href = 'https://onedrive.live.com/redir#hash';
        expect(new Href(href).getQueryString()).to.equal(undefined);
    });
    it('当查询字符串中有中文时', () => {
        const href = 'https://onedrive.live.com/redir?resid=中文&page=Edit&wd=what#hash';
        expect(new Href(href).getQueryString()).to.equal('resid=中文&page=Edit&wd=what');
    });
    it('通过实例方法getHash来获取链接中的hash值', () => {
        const href = 'https://onedrive.live.com/redir#hash';
        expect(new Href(href).getHash()).to.equal('hash');
    });
    it('当链接中没有hash值时，getHash方法将返回undefined', () => {
        const href = 'https://onedrive.live.com/redir#';
        expect(new Href(href).getHash()).to.equal(undefined);
    });
});

describe('parseQueryString方法测试', () => {
    it('解析queryString', () => {
        const queryString = 'resid=fdf&page=Edit&wd=what';
        const result = parseQueryString(queryString);
        const expectedResult = {
            resid: 'fdf',
            page: 'Edit',
            wd: 'what',
        };
        expect(JSON.stringify(result)).to.equal(JSON.stringify(expectedResult));
    });
    it('当queryString中有中文汉字时的解析', () => {
        const queryString = 'chn=汉字&page=10&title=真是太好了';
        const result = parseQueryString(queryString);
        const expectedResult = {
            chn: '汉字',
            page: '10',
            title: '真是太好了',
        };
        expect(JSON.stringify(result)).to.equal(JSON.stringify(expectedResult));
    });
    it('queryString中有多个相同key的时候', () => {
        const queryString = 'chn=汉字&chn=英文&chn=法语&page=10&page=20&title=真是太好了';
        const result = parseQueryString(queryString);
        const expectedResult = {
            chn: ['汉字', '英文', '法语'],
            page: ['10', '20'],
            title: '真是太好了',
        };
        expect(JSON.stringify(result)).to.equal(JSON.stringify(expectedResult));
    });
    it('queryString中的key没有value时，将不会获取该key', () => {
        const queryString = 'chn=&page=10&title=hello';
        const result = parseQueryString(queryString);
        expect(result.chn).to.equal(undefined);
    });
    it('方法stringifyQueryData将查询对象转成查询字符串', () => {
        const queryData: IQueryData = {
            chn: '汉字',
            page: '10',
            title: '真是太好了',
        };
        const queryString = stringifyQueryData(queryData);
        const verifyQueryString = queryString.split('&').every((tupleStr) => {
            return ['chn=汉字', 'page=10', 'title=真是太好了'].indexOf(tupleStr) !== -1;
        }) && queryString.split('&').length === 3;
        expect(verifyQueryString).to.equal(verifyQueryString);
    });
    it('queryData对象中有一些值是字符串数组时', () => {
        const queryData: IQueryData = {
            chn: ['汉字', '英文', '法语'],
            page: ['10', '20'],
            title: '真是太好了',
        };
        const queryString = stringifyQueryData(queryData);
        const queryStrings = ['chn=汉字', 'chn=英文', 'chn=法语', 'page=10', 'page=20', 'title=真是太好了'];
        const verifyQueryString = queryString.split('&').every((tupleStr) => {
            return queryStrings.indexOf(tupleStr) !== -1;
        }) && queryString.split('&').length === queryStrings.length;
        expect(verifyQueryString).to.equal(verifyQueryString);
    });
});
