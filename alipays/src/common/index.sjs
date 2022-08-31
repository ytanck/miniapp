// import * as CONSTANCE from '/common/constance';

// 格式化数据
export const ParseInt = (value) => {
    let newValue = parseInt(value);
    return isNaN(newValue) ? "***" : newValue / 1000;
};

// 保留小数
export const toFixed = (value, number = 1) => {
    return value.toFixed(number);
};

// 格式化数据
export const ParseIntAmount = (value) => {
    let newValue = parseInt(value);
    return isNaN(newValue) ? "***" : newValue;
};

//过滤价格

export const filterMsg = (str) => {
    var a = str.substring(0, str.indexOf("{"));
    var b = str.substring(str.indexOf("{") + 1, str.indexOf("}"));
    var c = str.substring(str.indexOf("}") + 1, str.length);
    var arr = [];
    arr[0] = a;
    arr[1] = b;
    arr[2] = c;
    // console.log(a)
    // console.log(b)
    // console.log(c)
    // console.log(arr)
    return arr;
};

// 数字三位加分隔符
export const numAddSeperator = (num, separator = ',') => {
    var pattern = getRegExp('(?=(?!\\b)(\\d{3})+$)', 'g')
    return num.toString().replace(pattern, separator);

}

// 图片是否有效
export const validImg = (url) => {
    return url != null && url !== '' && url !== '-1'
}
