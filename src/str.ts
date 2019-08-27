import { getRanInter } from "./math";

/**
 * 从dict中选取字符随机生成长度为len的字符串
 * @param dict 字符串字典集
 * @param len 生成字符串长度
 * @returns 随机的字符串
 */
export function getRanStrByDict(dict: string, len: number): string {
    let rs = '';
    for (let i = 0; i < len; i++) {
        rs += dict.charAt(getRanInter(0, dict.length - 1));
    }
    return rs;
}
/**
 * 个位数变成 0个位数 的格式
 * @param num 小于10的非负数
 * @returns 0数 的字符串或者转成字符串
 */
export function getZeroNumStr(num: number): string {
    return num < 10 ? '0' + num : String(num);
}