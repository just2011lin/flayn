/**
 * 一天的小时数
 */
export const dayHours = 24;
/**
 * 一天的分钟数
 */
export const dayMinutes = dayHours * 60;
/**
 * 一天的秒数
 */
export const daySeconds = dayMinutes * 60;
/**
 * 一天的毫秒数
 */
export const dayMills = daySeconds * 1000;

/**
 * 获取该日期（或天数差的那天）0时0分0秒的时间戳
 * @param date 日期对象
 * @param disNum 表示与该日期的天数差
 * @returns 返回日期0分0秒时的时间戳
 */
export function weeTime(date: Date, disNum: number = 0): number {
    const wee = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return wee + disNum * dayMills;
}

/**
 * 判断date与anotherDate是否为同一天
 * @param date 一个日期
 * @param anotherDate 另外一个日期
 * @returns true：是同一天
 */
export function isSameDay(date: Date, anotherDate = new Date()) {
    return weeTime(date) === weeTime(anotherDate);
}

/**
 * 判断date是否在startDate与endDate之内
 * @param date 判断的日期
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns true：在
 */
export function isInDate(date: Date, startDate: Date, endDate: Date): boolean {
    const thisTime = date.getTime();
    return thisTime >= startDate.getTime() && thisTime <= endDate.getTime();
}

/**
 * 依据一定规则将该日期对象转为字符串输出
 * @param date 日期对象
 * @param fmt 输出格式
 * @returns 按照fmt格式输出的结果
 * （代码出自网络，书写规范性不必严格要求）
 */
export function formatDate(date: Date, fmt2: string): string {
    let fmt = fmt2;
    const o: any = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
        }
    }
    return fmt;
}

/**
 * 计算两个日期相差的天数
 * @param dateX 日期1
 * @param dateY 日期2
 */
export function numberOfDayDifference(dateX: Date, dateY: Date): number{
    if(dateX instanceof Date && dateY instanceof Date){
        const weeTimeX = weeTime(dateX);
        const weeTimeY = weeTime(dateY);
        const timeOfDayDifference = Math.abs(weeTimeX - weeTimeY);
        return timeOfDayDifference / dayMills;
    }
    return 0;
}
