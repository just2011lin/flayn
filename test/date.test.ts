import { expect } from 'chai';
import 'mocha';
import { dayHours, dayMills, dayMinutes, daySeconds, isSameDay, weeTime, formatDate } from '../src/date';

describe('日期Date中常量测试', () => {
    it('一天的小时数dayHours是24', () => {
        expect(dayHours).to.equal(24);
    });
    it('一天的分钟数dayMinutes是24*60', () => {
        expect(dayMinutes).to.equal(24 * 60);
    });
    it('一天的毫秒数daySeconds是24*60*60', () => {
        expect(daySeconds).to.equal(24 * 60 * 60);
    });
    it('一天的毫秒数dayMills是24*60*60*1000', () => {
        expect(dayMills).to.equal(24 * 60 * 60 * 1000);
    });
});

describe('weeTime方法测试', () => {
    it('获取一个日期凌晨0时0分0秒0毫秒的时间戳', () => {
        const dateOne = new Date(2019, 8, 30, 15, 34);
        const dateTwo = new Date(2019, 8, 30);
        expect(weeTime(dateOne)).to.equal(weeTime(dateTwo));
    });
});

describe('isSameDay方法测试', () => {
    it('两个日期是同一天', () => {
        const dateOne = new Date(2019, 8, 30, 15);
        const dateTwo = new Date(2019, 8, 30, 10, 45, 40);
        expect(isSameDay(dateOne, dateTwo)).to.equal(true);
    });
    it('两个日期不是同一天', () => {
        const dateOne = new Date(2019, 8, 30, 15);
        const dateTwo = new Date(2018, 10, 10, 14);
        expect(isSameDay(dateOne, dateTwo)).to.equal(false);
    });
});

describe('formatDate方法测试', () => {
    it('将日期对象转为"yyyy-MM-dd hh:mm:ss"的格式', () => {
        const date = new Date(2019, 8, 30, 14, 30, 20);
        expect(formatDate(date, 'yyyy-MM-dd hh:mm:ss')).to.equal('2019-09-30 14:30:20');
    });
});
