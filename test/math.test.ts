import { expect } from 'chai';
import 'mocha';
import { getRanInter, getRanInters, getDiverseRanInter, getDiverseRanInters, getRanIndexByProportion } from '../src/math';


describe('用getRanInter方法获取两个数之间的随机一个数', () => {
    it('当两个数相同时，将获取这两个数', () => {
        expect(getRanInter(10, 10)).to.equal(10);
    });
    it('从10到15之间获取一个随机，随机获取1000次，并且每次获取的值都是大于等于10且小于等于15', () => {
        const arr = [];
        for (let i = 0; i < 1000; i++) {
            arr.push(getRanInter(10, 15));
        }
        const everyFunc = (num: number) => { return num >= 10 && num <= 15 };
        expect(arr.every(everyFunc)).to.equal(true);
    });
})

describe('用getRanInters方法获取两个数之间的数个随机数', () => {
    it('当两个数同为10且获取3个随机数时，将获取[10,10,10]', () => {
        const min = 10;
        const max = 10;
        const num = 3;
        const result = JSON.stringify(getRanInters(min, max, num));
        const expectedResult = JSON.stringify([10, 10, 10]);
        expect(result).to.equal(expectedResult);
    });
    it('从10到15获取1000个随机数，那么获取的1000个随机数将都是大于等于10且小于等于15', () => {
        const arr = getRanInters(10, 15, 1000);
        expect(arr.every(num => {
            return num >= 10 && num <= 15;
        })).to.equal(true);
    });
    it('从10到15获取10000个随机数，那么获取到10、11、12、13、14、15的概率均大于0.15小于0.18', () => {
        const arr = getRanInters(10, 15, 10000);
        const arr10 = arr.filter(num => num === 10);
        const arr11 = arr.filter(num => num === 11);
        const arr12 = arr.filter(num => num === 12);
        const arr13 = arr.filter(num => num === 13);
        const arr14 = arr.filter(num => num === 14);
        const arr15 = arr.filter(num => num === 15);
        const arrNums = [arr10, arr11, arr12, arr13, arr14, arr15];
        const result = arrNums.every(arrNum => {
            const rare = arrNum.length / 10000;
            return rare > 0.15 && rare < 0.18;
        })
        expect(result).to.equal(true);
    });
})

describe('用getDiverseRanInter方法用于获取一个没有获取过的一个随机数', () => {
    it('从10到15之间获取一个不在[10,11,12]的数1000次，并且没有一个获取的数在[10,11,12]中', () => {
        const min = 10;
        const max = 15;
        const sNums = [10, 11, 12];
        const rNums = [];
        for (let i = 0; i < 1000; i++) {
            rNums.push(getDiverseRanInter(min, max, sNums));
        }
        const result = rNums.every(num => !(sNums.indexOf(num) > -1));
        expect(result).to.equal(true);
    });
    it('从10到15之间获取一个不在[10,11,12]的数1000次，并且获取的数都是大于等于10且小于等于15', () => {
        const min = 10;
        const max = 15;
        const sNums = [10, 11, 12];
        const rNums = [];
        for (let i = 0; i < 1000; i++) {
            rNums.push(getDiverseRanInter(min, max, sNums));
        }
        const result = rNums.every(num => num >= 10 && num <= 15);
        expect(result).to.equal(true);
    });
})

describe('用getDiverseRanInters方法获取数个不同的随机数', () => {
    it('从10到15中取3个不同的数1000次，获取的数均大于等于10小于等于15', () => {
        const min = 10;
        const max = 15;
        const rArrs = [];
        for (let i = 0; i < 1000; i++) {
            rArrs.push(getDiverseRanInters(min, max, 3));
        }
        const result = rArrs.every(arr => arr.every(num => num >= 10 && num <= 15));
        expect(result).to.equal(true);
    });
    it('从10到15中去3个不同的数1000次，获取的数均不相同', () => {
        const min = 10;
        const max = 15;
        const rArrs: number[][] = [];
        for (let i = 0; i < 1000; i++) {
            rArrs.push(getDiverseRanInters(min, max, 3));
        }
        const result = rArrs.every(arr => arr.every(num => arr.indexOf(num) === arr.lastIndexOf(num)));
        expect(result).to.equal(true);
    });
})


describe('用getRanIndexByProportion按比例获取一个随机数', () => {
    it('按[10,20,30,40]的比例获取一个随机数10000次，获取0、1、2、3的概率大概为10%、20%、30%、40%，即获取0的次数大于9%小于11%', () => {
        const proportions = [10, 20, 30, 40];
        const nums: number[] = [];
        const size = 10000;
        for (let i = 0; i < size; i++) {
            nums.push(getRanIndexByProportion(proportions));
        }
        const zeroPercent = nums.filter(num => num === 0).length / size;
        const onePercent = nums.filter(num => num === 1).length / size;
        const twoPercent = nums.filter(num => num === 2).length / size;
        const threePercent = nums.filter(num => num === 3).length / size;
        const zeorResult = zeroPercent > 0.09 && zeroPercent < 0.11;
        const oneReulst = onePercent > 0.19 && onePercent < 0.21;
        const twoResult = twoPercent > 0.29 && twoPercent < 0.31;
        const threeResult = threePercent > 0.39 && threePercent < 0.41;
        expect(zeorResult && oneReulst && twoResult && threeResult).to.equal(true);
    })
})
