module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1590335181339, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var date_helper_1 = require("./date-helper");
var dateHelper = new date_helper_1.default();
/**
 * 解析时间，格式化符号有下列几种：
 *
 * yyyy : 四位数的年份。例如：2018
 *
 * yy   : 两位数的年份。例如：18
 *
 * MM   : 两位数月份，从 01 开始。01-12
 *
 * M    : 一位数月份，从 1 开始。1-12
 *
 * dd   : 两位天数。01-31
 *
 * d    : 一位天数。1-31
 *
 * HH   : 两位小时，24小时制。00-23
 *
 * H    : 一位小时，24小时制。0-23
 *
 * mm   : 两位分钟。00-59
 *
 * m    : 一位分钟。0-59
 *
 * ss   : 两位秒。00-59
 *
 * s    : 一位秒。0-59
 *
 * E    ：星期数。0-6，星期天是 0
 * @param input - 格式化的时间字符串
 * @param formatText - 格式化符号
 * @returns 日期对象
 */
function parse(input, formatText) {
    return dateHelper.parse(input, formatText);
}
exports.parse = parse;
/**
 * 格式化时间，格式化符号有下列几种：
 *
 * yyyy : 四位数的年份。例如：2018
 *
 * yy   : 两位数的年份。例如：18
 *
 * MM   : 两位数月份，从 01 开始。01-12
 *
 * M    : 一位数月份，从 1 开始。1-12
 *
 * dd   : 两位天数。01-31
 *
 * d    : 一位天数。1-31
 *
 * HH   : 两位小时，24小时制。00-23
 *
 * H    : 一位小时，24小时制。0-23
 *
 * mm   : 两位分钟。00-59
 *
 * m    : 一位分钟。0-59
 *
 * ss   : 两位秒。00-59
 *
 * s    : 一位秒。0-59
 *
 * E    ：星期数。0-6，星期天是 0
 * @param date - 日期对象
 * @param formatText - 格式化符号
 * @returns 格式化的时间字符串
 */
function format(date, formatText) {
    return dateHelper.format(date, formatText);
}
exports.format = format;

}, function(modId) {var map = {"./date-helper":1590335181340}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1590335181340, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
function formatNumberParts(numberParts) {
    return numberParts.map(function (i) { return Number(i); });
}
// 通过需要匹配的字符串，创建正则表达式，对元字符进行转义
function regexEscape(regText) {
    return regText.replace(constants_1.REGEX_SPECIAL_CHARACTER, '\\$&');
}
// 把年份最后两位变成0
var get2Year = function (date) {
    return Number((date.getFullYear() + '').replace(/\d{2}$/, '00'));
};
// 一位数字变成两位数字左补0
var get2 = function (value) { return (value < 10 ? '0' + value : value + ''); };
// 获取相对应的日期相关数据
var getValueByPattern = function (fmt, date) {
    var patterns = {
        yy: (date.getFullYear() + '').slice(-2),
        yyyy: date.getFullYear(),
        M: date.getMonth() + 1,
        MM: get2(date.getMonth() + 1),
        d: date.getDate(),
        dd: get2(date.getDate()),
        H: date.getHours(),
        HH: get2(date.getHours()),
        m: date.getMinutes(),
        mm: get2(date.getMinutes()),
        s: date.getSeconds(),
        ss: get2(date.getSeconds()),
        E: date.getDay()
    };
    return patterns[fmt];
};
// 解析时间中间数据
var getParseInfo = function (input, format) {
    var regexpText = regexEscape(format);
    var index = 0;
    var result = {
        tokenMap: {},
        numberParts: [],
        errorFlag: false
    };
    // 记录格式化符号在捕获组中的索引
    regexpText = regexpText.replace(constants_1.PARSE_TOKEN, function (token) {
        result.tokenMap[token] = index++;
        return constants_1.TOKEN_REGEX_MAP[token];
    });
    regexpText = "^" + regexpText + "$";
    // 获取捕获组 存入numberParts
    var match = input.match(new RegExp(regexpText)) || [];
    if (match.length === 0) {
        result.errorFlag = true;
    }
    else {
        match.shift();
        result.numberParts = match.slice();
    }
    return result;
};
/**
 * DateHelper 类
 */
var DateHelper = /** @class */ (function () {
    function DateHelper() {
    }
    /**
     * 格式化时间
     * @remarks
     * 格式化符号有下列几种
     * yyyy : 四位数的年份。例如：2018
     * yy   : 两位数的年份。例如：18
     * MM   : 两位数月份，从 01 开始。01-12
     * M    : 一位数月份，从 1 开始。1-12
     * dd   : 两位天数。01-31
     * d    : 一位天数。1-31
     * HH   : 两位小时，24小时制。00-23
     * H    : 一位小时，24小时制。0-23
     * mm   : 两位分钟。00-59
     * m    : 一位分钟。0-59
     * ss   : 两位秒。00-59
     * s    : 一位秒。0-59
     * E    ：星期数。0-6，星期天是 0
     * @param date - 日期对象
     * @param format
     * @returns 格式化的时间字符串
     */
    DateHelper.prototype.format = function (date, format) {
        if (!(date instanceof Date)) {
            return '';
        }
        format = format || constants_1.DEFAULT_FORMAT;
        format = format.replace(constants_1.FORMAT_TOKEN, function (part) { return getValueByPattern(part, date) + ''; });
        return format;
    };
    /**
     * 解析时间
     * @remarks
     * 格式化符号有下列几种
     * yyyy : 四位数的年份。例如：2018
     * yy   : 两位数的年份。例如：18
     * MM   : 两位数月份，从 01 开始。01-12
     * M    : 一位数月份，从 1 开始。1-12
     * dd   : 两位天数。01-31
     * d    : 一位天数。1-31
     * HH   : 两位小时，24小时制。00-23
     * H    : 一位小时，24小时制。0-23
     * mm   : 两位分钟。00-59
     * m    : 一位分钟。0-59
     * ss   : 两位秒。00-59
     * s    : 一位秒。0-59
     * @param input - 格式化的时间字符串
     * @param format
     * @returns 日期对象
     */
    DateHelper.prototype.parse = function (input, format) {
        if (!input || !format) {
            return new Date(NaN);
        }
        if (typeof input !== 'string' || typeof format !== 'string') {
            return new Date(NaN);
        }
        var parseInfo = getParseInfo(input, format);
        if (parseInfo.errorFlag) {
            return new Date(NaN);
        }
        // 例如 ['2018','12','25']
        var matchParts = parseInfo.numberParts;
        // 例如{yyyy:0,MM:1,dd:2} yyyy对应的年在matchParts中的索引是0
        var fmt = parseInfo.tokenMap;
        // 变成数字数组 用于 new Date 方法
        var parts = formatNumberParts(matchParts);
        var year = parts[fmt.yyyy] || parts[fmt.yy] || constants_1.DEFAULT_YEAR;
        if (matchParts[fmt.yy]) {
            year += get2Year(new Date());
        }
        var month = (parts[fmt.MM] || parts[fmt.M] || constants_1.DEFAULT_MONTH) - 1;
        var date = parts[fmt.dd] || parts[fmt.d] || constants_1.DEFAULT_DATE;
        var hour = parts[fmt.HH] || parts[fmt.H] || constants_1.DEFAULT_HOUR;
        var minute = parts[fmt.mm] || parts[fmt.m] || constants_1.DEFAULT_MINUTE;
        var second = parts[fmt.ss] || parts[fmt.s] || constants_1.DEFAULT_SECOND;
        return new Date(year, month, date, hour, minute, second);
    };
    return DateHelper;
}());
exports.default = DateHelper;

}, function(modId) { var map = {"../constants":1590335181341}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1590335181341, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
// 根据符号匹配对应年月日时分秒的数字,通过构造函数实例化正则表达式
exports.TOKEN_REGEX_MAP = {
    yy: '(\\d{2})',
    yyyy: '(\\d{4})',
    M: '((?:1[0-2])|[1-9])',
    MM: '((?:0[1-9])|(?:1[0-2]))',
    d: '((?:[1-2]\\d)|(?:3[0-1])|[1-9])',
    dd: '((?:0[1-9])|(?:[1-2]\\d)|(?:3[0-1]))',
    H: '((?:1\\d)|(?:2[0-3])|\\d)',
    HH: '((?:[0-1]\\d)|(?:2[0-3]))',
    m: '((?:[1-5]\\d)|\\d)',
    mm: '([0-5]\\d)',
    s: '((?:[1-5]\\d)|\\d)',
    ss: '([0-5]\\d)'
};
// 匹配一个正则表达式中的元字符
exports.REGEX_SPECIAL_CHARACTER = /[-\/\\^$*+?.()|[\]{}]/g;
// 匹配一个用来解析时间的格式化符号
exports.PARSE_TOKEN = /yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s/g;
// 匹配一个用来格式化时间的格式化符号
exports.FORMAT_TOKEN = /yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s|E/g;
// 格式化日期时 默认的格式化参数
exports.DEFAULT_FORMAT = 'yyyy-MM-dd';
// 解析时间时，默认的年
exports.DEFAULT_YEAR = 0;
// 解析时间时，默认的月
exports.DEFAULT_MONTH = 1;
// 解析时间时，默认的日
exports.DEFAULT_DATE = 1;
// 解析时间时，默认的时
exports.DEFAULT_HOUR = 0;
// 解析时间时，默认的分
exports.DEFAULT_MINUTE = 0;
// 解析时间时，默认的秒
exports.DEFAULT_SECOND = 0;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1590335181339);
})()
//# sourceMappingURL=index.js.map