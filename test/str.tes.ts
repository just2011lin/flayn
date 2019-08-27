import { expect } from 'chai';
import 'mocha';
import { getRanStrByDict, getZeroNumStr } from '../src/str';

describe('getRanStrByDict用于在一段字符串中取一段随机字符组成的字符串', () => {
    it('从abcdefg中取出长度为3的字符串1000次，且每次取出的字符串中的字符均在abcdefg中', () => {
        const dict = 'abcdefg';
        const len = 3;
        const strs: string[] = [];
        for (let i = 0; i < 1000; i++) {
            strs.push(getRanStrByDict(dict, len));
        }
        const result = strs.every(str => str.split('').every(char => dict.indexOf(char) > -1));
        expect(result).to.equal(true);
    });
    it('从abcdefg中取出长度为3的字符串10000次，最后取出的字符串有343个组合', () => {
        const dict = 'abcdefg';
        const len = 3;
        const strs: string[] = [];
        for (let i = 0; i < 10000; i++) {
            strs.push(getRanStrByDict(dict, len));
        }
        const obj: { [key: string]: boolean } = {};
        strs.forEach(str => {
            obj[str] = true;
        })
        expect(Object.keys(obj).length).to.equal(343);
    });
    it('从abcdefg中取出长度为3的字符串1000次，取出的字符串长度均为3', () => {
        const dict = 'abcdefg';
        const len = 3;
        const strs: string[] = [];
        for (let i = 0; i < 1000; i++) {
            strs.push(getRanStrByDict(dict, len));
        }
        const result = strs.every(str => str.length === 3);
        expect(result).to.equal(true);
    });
})

describe('getZeroNumStr方法用于将一位的数补全为0+一位数的格式', () => {
    it('将数字0补全，将得到00字符串', () => {
        expect(getZeroNumStr(0)).to.equal('00');
    });
    it('将数字7补全，将得到07的字符串', () => {
        expect(getZeroNumStr(7)).to.equal('07');
    });
    it('传入数字24，将得到24的字符串', () => {
        expect(getZeroNumStr(24)).to.equal('24');
    });
    it('传入数字1.3，将得到01.3的字符串', () => {
        expect(getZeroNumStr(1.3)).to.equal('01.3');
    });
})