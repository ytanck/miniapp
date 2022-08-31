import { SUCESS_CODE } from "../common/constance";
const Ajax = require("./AjaxUtil");
const hostConfig = require("/config.js");

// const useMock = true
const useMock = false;
const addResponseTime = 0; // 增加返回时间，模拟网络差

const instance = Ajax.create({
  useMock,
  baseURL: hostConfig.fuyaoUrl,
  timeout: 100000,
  concurrency: 6,
});

const sleep = (time = 0) => {
  return new Promise((resolve, reject) => {
    if (time) {
      setTimeout(() => {
        resolve();
      }, time);
    } else {
      resolve();
    }
  });
};

const getBaseAuthCode = (isAuthCodeMust = false) => {
  // 判断缓存
  const lunaSessionId = getApp().globalData.lunaSessionId;
  if (lunaSessionId && !isAuthCodeMust) {
    return Promise.resolve({ lunaSessionId });
  } else {
    console.log("getbaseAuthCode");
    return new Promise((resolve, reject) => {
      my.getAuthCode({
        scopes: "auth_base",
        success: (res) => {
          const { authCode } = res;
          if (!authCode || typeof authCode !== "string") {
            my.hideLoading();
            reject({ message: "获取用户信息失败" });
          } else {
            console.log("authCode: " + authCode);
            getApp().globalData.authCode = authCode;
            resolve({ authCode });
          }
        },
        fail: () => {
          my.hideLoading();
          reject({ message: "获取用户信息失败" });
        },
      });
    });
  }
};

// 埋点 拦截request
const requestInterceptorFunc = (config) => {
  const app = getApp();
  if (config.baseURL === hostConfig.fillPoint) {
    config.data.uid = app.globalData.zfbUid || "";
  }
  return config;
};
// 拦截request
const requestInterceptorFuncWrapper = (config) => {
  const app = getApp();
  // 埋点请求
  if (config.baseURL === hostConfig.fillPoint) {
    return Promise.resolve(requestInterceptorFunc(config));
  }
  if (config.baseURL === hostConfig.mpBaseUrl) {
    config.headers.xAuthToken = app.globalData.xAuthToken;
    return config;
  }
  if (config.encrypt === true && config.data) {
    console.log("params参数=======", config.data);
    const config_ = {};
    const timestamp = new Date().getTime();
    const content = app.encrypt(config.data);
    const sign = app.md5ForFy(content, timestamp);
    config_.timestamp = timestamp;
    config_.content = content;
    config_.sign = sign;
    config.data = config_;
    return config;
  }

  // 获取lunaSessionId
  return getBaseAuthCode(config.isAuthCodeMust)
    .then(({ authCode, lunaSessionId }) => {
      const { appId, acCode } = getApp().globalData;
      const config_data = { authCode, appId, acCode };
      if (lunaSessionId) {
        // 如果存在lunaSessionId 删除authCode
        config_data.lunaSessionId = lunaSessionId;
        delete config_data.authCode;
      }
      config.data = {
        ...config_data,
        ...config.data,
      };
      return config;
    })
    .catch((err) => {
      console.log(err);
      return config;
    });
};
// Request 拦截器
instance.interceptors.request.use(requestInterceptorFuncWrapper);

// response 拦截器
const responseInterceptorFunc = (response = {}, config) => {
  const app = getApp();
  if (response && response.code === SUCESS_CODE && response.lunaSessionId) {
    app.globalData.lunaSessionId = response.lunaSessionId;
    app.globalData.uid = response.lunaBuryUid;
  } else if (
    response.code !== SUCESS_CODE &&
    config.baseURL !== hostConfig.fillPoint
  ) {
    my.hideLoading();
  }
  if (config.loading && !config.subQueue) {
    my.hideLoading();
  }

  return Promise.resolve(response);
};
const responseInterceptorFuncWrapper = (response = {}, config) => {
  if (addResponseTime) {
    return sleep(addResponseTime).then(() => {
      return responseInterceptorFunc(response, config);
    });
  } else {
    return responseInterceptorFunc(response, config);
  }
};
const responseInterceptorErrFunc = (err, config = {}) => {
  my.hideLoading();
  if (addResponseTime) {
    return sleep(addResponseTime).then(() => {
      return Promise.resolve(err);
    });
  } else {
    return Promise.resolve(err);
  }
};
instance.interceptors.response.use(
  responseInterceptorFuncWrapper,
  responseInterceptorErrFunc
);

const getInstance = {
  get(options = {}) {
    options.method = "GET";
    return getInstance.http((options = {}));
  },
  post(options = {}) {
    options.method = "POST";
    return getInstance.http((options = {}));
  },
  http(options = {}) {
    const { ...others } = options;
    return instance.http(others);
  },
};

/* -------------------接口-------------------- */
module.exports = {
  // 数据收集
  LOG(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.fillPoint,
      url: "/spm/burydata",
      method: "POST",
      subQueue: true,
      data,
      ...options,
    });
  },
  // 新埋点方案
  D2V_LOG(data = {}) {
    console.log("D2V_LOG");
    // const globalData = getApp().globalData;
    const { appId, channel, zfbUid, systemInfo, network } = getApp().globalData;
    return getInstance.http({
      baseURL: hostConfig.newMd,
      url: "/spm/burydata",
      method: "POST",
      data: {
        app_id: "ST20220815172040056",

        app_ver: "0.0.1",
        tenant_code: "",
        uid: zfbUid,
        spm_value: "",
        action: "",
        spm_time: parseInt(new Date().getTime() / 1000),
        resource_spm: "",
        mobile: systemInfo.model, //客户端机型信息
        browser: systemInfo.app, // 客户端浏览器信息
        browser_core: systemInfo.version, // 浏览器内核
        channel: channel || "self",
        channel2: "", //二级渠道
        other: "",
        device_brand: systemInfo.brand,
        device_model: systemInfo.model,
        network: network, // 网络类型
        os: systemInfo.platform, // 操作系统
        os_version: systemInfo.system, // 操作系统版本
        uri: "", //当前页面路径（绝对路径）
        user_agent: "",
        ...data,
        events: data.events ? JSON.stringify(data.events) : "",
      },
    });
  },

  // 查询用户信息
  QUERY_USER_INFO(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/user/info",
      method: "GET",
      data,
      ...options,
    });
  },

  // 查询活动信息
  GET_AC_INFO_ALL(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/activity/info/all",
      method: "GET",
      data,
      ...options,
    });
  },

  // 首页-签到区查询连续签到天数/周期内连续签到状态
  QUERY_USER_SIGN(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/activity/sign/v1/queryUserSign",
      method: "GET",
      data,
      ...options,
    });
  },
  // 任务多个完成情况指定任务查询接口
  QUERY_TASK_STATUS(data = {}, options = {}) {
    data.apmbA = "ST20220815172040056";
    return getInstance.http({
      url: "/app/task/query/task",
      method: "GET",
      data,
      ...options,
    });
  },
  // 任务单个任务完成情况指定任务查询接口
  QUERY_ONE_TASK_STATUS(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/task/query/task-one",
      method: "GET",
      data,
      ...options,
    });
  },
  // 签到接口
  TASK_FINISH(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/task/finish",
      method: "GET",
      data,
      ...options,
    });
  },
  // 兑换页-查询兑换奖品列表
  AWARD_QRY_LIST(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/award/queryList",
      method: "GET",
      data,
      ...options,
    });
  },

  // 去完成普通任务
  GO_FINISH_TASK(data = {}, options = {}) {
    data.apmbA = "ST20220815172040056";
    return getInstance.http({
      url: "/app/task/urlgenerate",
      method: "GET",
      data,
      ...options,
    });
  },

  // 获取我的抽奖
  GET_PRIZE_LIST(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/user/prize/info",
      method: "GET",
      data,
      ...options,
    });
  },
  // 获取抽奖人数
  GET_ACT_NUM(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/statistics/winning-count",
      method: "GET",
      data,
      ...options,
    });
  },
  // 话费券领取
  WINNING_INFO(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/user/prize/add/winning-info",
      method: "GET",
      data,
      ...options,
    });
  },
  // 抽奖
  ACT_DRAW(data = {}, options = {}) {
    data.apmbA = "ST20220815172040056";
    return getInstance.http({
      url: "/app/activity/draw",
      method: "GET",
      data,
      ...options,
    });
  },
  // 积分抽奖
  EXCH_DRAW(data = {}, options = {}) {
    data.apmbA = "ST20220815172040056";
    return getInstance.http({
      url: "/app/activity/sign/exchange-draw",
      method: "GET",
      data,
      ...options,
    });
  },

  // 获取分享码
  GET_SHARE_CODE(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/task/getShareCode",
      method: "GET",
      data,
      ...options,
    });
  },
  // 查询配置奖品列表
  AWARD_QUERY_LIST(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/award/queryList",
      method: "GET",
      data,
      ...options,
    });
  },

  // 推啊广告事件上报
  reportAdvertisingEvents(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/advert/eventReport",
      method: "GET",
      data,
      ...options,
    });
  },
  // 查询星火配置
  QUERY_STAR_FIRE_CONF(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.xinghuoURL,
      url: "/gaoyang/rpOnlReceiptGeneralMulitService/dv/1.0/adBill",
      method: "GET",
      data,
      ...options,
    });
  },
  // 用户疲劳度点击同步接口
  userClickAdBill(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.xinghuoURL,
      url: "/gaoyang/userStatisticsService/dv/1.0/adBill",
      method: "POST",
      encrypt: true,
      data,
      ...options,
    });
  },

  // 获取加密token
  GET_UID_TOKEN(data = {}, options = {}) {
    return getInstance.http({
      url: "/app/s/encryption/uid",
      method: "GET",
      data,
      ...options,
    });
  },

  // 双V查询身份信息TODO:
  DV_QUERY_USERINFO(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/query_userInfo",
      method: "GET",
      data,
      ...options,
    });
  },

  // 双V查询订阅
  DV_QUERY_SUB(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/msgtemplate/subscribe/queryOne",
      method: "GET",
      data,
      ...options,
    });
  },
  // 双V取消订阅
  DV_CANCEL_SUB(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/msgtemplate/subscribe/cancel",
      method: "GET",
      data,
      ...options,
    });
  },
  // 双V保存订阅
  DV_SAVE_SUB(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/msgtemplate/subscribe/saveOne",
      method: "GET",
      data,
      ...options,
    });
  },
  // 更新订单信息
  UPDATE_ORDER_INFO(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/paymember/updateOrderInfo",
      method: "GET",
      data,
      ...options,
    });
  },
  // 获取订购列表
  QUERY_ORDER_METHOD_LIST(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/queryOrderMethodList",
      method: "GET",
      data,
      ...options,
    });
  },
  // 连续代扣创建订单
  CREATE_CYCLE_ORDER(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/paymember/createCycleOrder",
      method: "GET",
      data,
      ...options,
    });
  },
  // 更新订单信息
  UPDATE_PAY_ORDER_STATUS(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/payMember/updatePayOrderStatus",
      method: "GET",
      data,
      ...options,
    });
  },
  // 用户资格校验接口
  CHECK_SIGN_QUALIFY(data = {}, options = {}) {
    return getInstance.http({
      baseURL: hostConfig.mpBaseUrl,
      url: "/checkSignQualify",
      method: "GET",
      data,
      ...options,
    });
  },
};
