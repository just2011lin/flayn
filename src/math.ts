/**
 * 从一个整数范围获取一个随机整数
 * @param min 可能较小的值
 * @param max 可能较大的值
 * @returns 随机取到的值；min和max相等则返回min；能够取到min和max
 */
export function getRanInter(_min: number, _max: number): number {
    let min = _min, max = _max;
    if (min === max) {
        return min;
    }
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max + 1 - min) + min);
}
/**
 * 从一个整数范围内取出数个（num）可重复的随机数
 * @param min 可能较小的值
 * @param max 可能较大的值
 * @returns {Array<number>} 从min和max范围内随机取出的值
 */
export function getRanInters(min: number, max: number, num: number): number[] {
    let rsNums = [];
    for (let i = 0; i < num; i++) {
        rsNums.push(getRanInter(min, max));
    }
    return rsNums;
}
/**
 * 在min和max之间取一个sNums中没有的值
 * @param min 可能较小的值
 * @param max 可能较大的值
 * @param sNums 不想重复的值
 * @returns 返回从min和max范围随机取到的并且sNums没有的值
 */
export function getDiverseRanInter(min: number, max: number, sNums: number[]): number {
    let sNum = getRanInter(min, max);
    if (sNums.indexOf(sNum) > -1) {
        return getDiverseRanInter(min, max, sNums);
    }
    return sNum;
}
/**
 * 在min和max中取几个不相同的值（注意min/max/num的值）
 * @param min 可能较小的值
 * @param max 可能较大的值
 * @param num 取值的个数
 * @returns 返回取出的值
 */
export function getDiverseRanInters(min: number, max: number, num: number): number[] {
    if (Math.abs(max - min) < num) {
        throw new Error('max减去min小于num，请检查！');
    }
    let sNums: number[] = [];
    for (let i = 0; i < num; i++) {
        sNums.push(getDiverseRanInter(min, max, sNums));
    }
    return sNums;
}
/**
 * 按照给出的一定比例来获取一个随机的数
 * @param proportions 一定的比例数组成的数组
 * @returns 按比例获取的在数组中的索引值
 */
export function getRanIndexByProportion(proportions: number[]): number {
    // 有几种球
    let length = proportions.length;
    // 共有多少球
    let total = 0;
    // 计算辅助变量
    let _total = 0;
    // 随机数比较基数
    let sortEnd = 1000000;
    // 为每种球生成一个区间
    let sortProbArr = [0];
    // 获取在区间的一个数
    let randomNum = Math.random() * sortEnd;
    total = proportions.reduce(function (sum, value) {
        return sum + value;
    }, 0);
    proportions.reduce(function (sum, value) {
        _total = sum + value;
        sortProbArr.push(_total / total * sortEnd);
        return _total;
    }, 0);
    sortProbArr[length] = sortEnd + 1;
    for (let i = 0; i < proportions.length; i++) {
        if (randomNum >= sortProbArr[i] && randomNum < sortProbArr[i + 1]) {
            return i;
        }
    }
}