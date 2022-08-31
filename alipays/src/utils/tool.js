// 节流
export const throttle = (fn, timer = 500) => {
  let preTime;
  return function (params) {
    const nowTime = new Date();
    if (!preTime || nowTime - preTime > timer) {
      fn.call(this, params);
      preTime = nowTime;
    }
  };
};

// 函数防抖
export const debounce = (func, wait) => {
  let timer;
  return function () {
    const context = this; // 注意 this 指向
    const args = arguments; // arguments中存着e

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

// 判断版本
export const checkVersion = () => {
  try {
    const currentVersion = my.SDKVersion || {}; // 获取当前版本号
    const currVersionArray = currentVersion.split("."); // 分割成数组
    const BASE_VERSION = ["1", "8", "0"]; // 定义基础版本
    for (const index in BASE_VERSION) {
      if (Number(currVersionArray[index]) > Number(BASE_VERSION[index])) {
        return true;
      } else if (
        Number(currVersionArray[index]) === Number(BASE_VERSION[index])
      ) {
        if (index === BASE_VERSION.length - 1) {
          return true;
        }
        continue;
      } else {
        return false;
      }
    }
  } catch (err) {
    return false;
  }
};

export const qs = {
  parse: (str = "") => {
    const arr = str.split("&");
    const obj = {};
    arr.forEach((item) => {
      const index = item.indexOf("=");
      const key = item.slice(0, index);
      const val = item.slice(index + 1);
      obj[key] = val;
    });
    return obj;
  },
  stringify: (obj = {}) => {
    const arr = [];
    for (const key in obj) {
      arr.push(key + "=" + obj[key]);
    }
    return arr.join("&");
  },
};

// 日期格式化(YYYY-MM-dd HH:mm:ss-YYYY年MM月DD日)
export const formatDate = (date, fmt = "YYYY年MM月DD日") => {
  if (date == null) return null;
  if (typeof date === "string") {
    date = date.slice(0, 19).replace("T", " ").replace(/-/g, "/");
    date = new Date(date);
  } else if (typeof date === "number") {
    date = new Date(date);
  }
  const o = {
    "[Yy]+": date.getFullYear(), // 年
    "M+": date.getMonth() + 1, // 月份
    "[Dd]+": date.getDate(), // 日
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    "H+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  const week = {
    0: "/u65e5",
    1: "/u4e00",
    2: "/u4e8c",
    3: "/u4e09",
    4: "/u56db",
    5: "/u4e94",
    6: "/u516d",
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? "/u661f/u671f"
          : "/u5468"
        : "") + week[date.getDay() + ""]
    );
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

// 获取月份的天数
export const getMonthDays = (year, month) => {
  var stratDate = new Date(year, month - 1, 1);
  var endData = new Date(year, month, 1);
  var days = (endData - stratDate) / (1000 * 60 * 60 * 24);
  return days;
};

export const compare = (property) => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  };
};

export const formatString = (target) => {
  if (!target) return null;
  return typeof target === "string" ? JSON.parse(target) : target;
};

export const unique = (arr, key) => {
  const res = new Map();
  return arr.filter((a) => !res.has(a[key]) && res.set(a[key], 1));
};
// 按数组的某一项进行升序排序
export const arrSort = (property) => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
};
// 判断奖品是否在当前刷新周期内  taskRefreshCircle刷新周期  item奖品信息
export const isFreshCirclePrize = (taskRefreshCircle, item) => {
  const date = item.gmtCreate;
  if (!date) {
    return false;
  }
  const now = new Date();
  const weekday = now.getDay();
  let flag = true; // date时间是否在当前周期时间范围内

  switch (taskRefreshCircle) {
    case 0: // 按天刷新
      flag =
        formatDate(now).substring(0, 10) ===
        date.substring(0, 10).replace(/[\u4E00-\u9FA5]/g, "-");
      break;
    case 1: // 按周刷新
      // 计算周一日期
      const monday = new Date(
        now.getTime() - (weekday > 0 ? weekday - 1 : 6) * 24 * 60 * 60 * 1000
      ); // 周一的日期
      flag =
        date.substring(0, 10).replace(/[\u4E00-\u9FA5]/g, "-") >=
        formatDate(monday).substring(0, 10);
      break;
    case 2: // 按月刷新
      flag =
        date.substring(0, 10).replace(/[\u4E00-\u9FA5]/g, "-") >=
        formatDate(now).substring(0, 7) + "-01";
      break;
    default:
      break;
  }
  return flag;
};

// 根据position进行指定位置排序
export const defineSort = (arr = [], prop) => {
  if (arr.length == 0) return;
  return arr.sort(function (a, b) {
    // order是规则  arr是需要排序的数du组
    var order = [1, 2, 3, 8, 4, 7, 6, 5];
    // var order = [1, 2, 3, 5, 8, 7, 6, 4];
    return order.indexOf(a[prop]) - order.indexOf(b[prop]);
  });
};
export const userStatus = (memberLevel) => {
  let userLevel = "";
  switch (Number(memberLevel)) {
    case -1:
      userLevel = "未授权用户";
      break;
    case 0:
      userLevel = "授权用户";
      break;
    case 1:
      userLevel = "体验会员";
      break;
    case 2:
      userLevel = "尊享会员";
      break;
    case 3:
      userLevel = "黄金会员";
      break;

    default:
      userLevel = "未授权用户";
      break;
  }
  return userLevel;
};
