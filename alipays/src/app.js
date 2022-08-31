import "./utils/polyfill";
import { checkVersion } from "./utils/tool";

// import * as PageMixin from "/utils/pageMixin";
import CryptoJS from "crypto-js";
import md5 from "js-md5";
const _KEV = "iHATLhQo0zln1508";
const _IV = "iHATLhQo0zln1508";

App({
  globalData: {
    appId: "2018111462170339", // appId 渠道Id
    systemInfo: undefined,
    authCode: undefined, // authCode 支付宝授权code
    lunaSessionId: undefined, // token Id
    acCode: undefined, // acCode 活动ID
    channel: "self", // 渠道
    uid: undefined, // 用户ID
    config: {}, // 活动配置文件
    sourceId: "self", // 渠道
    network: "",
  },
  onLaunch(options) {
    // 程序初始化
    console.log("app onlaunch", options);
    const { query = {}, referrerInfo = {} } = options;
    const channel =
      (query || {}).sourceId || ((referrerInfo || {}).extraData || {}).sourceId;

    this.getSystemInfo();
    this.getNetWorkType();
    if (!checkVersion()) {
      // 查看当前基础库版本
      if (!my.canIUse("plugin") && !my.isIDE) {
        my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
      }
      my.alert({
        content: "亲，您当前的版本过低，请升级至最新版本",
      });
    }
  },

  terminal() {
    const { platform } = my.getSystemInfoSync();
    return platform;
  },
  getSystemInfo() {
    if (this.globalData.systemInfo) {
      return Promise.resolve(this.globalData.systemInfo);
    } else {
      return new Promise((resolve, reject) => {
        my.getSystemInfo({
          success: (res) => {
            this.globalData.systemInfo = res;
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    }
  },
  getNetWorkType() {
    my.getNetworkType({
      success: (res) => {
        this.globalData.network = res.networkType;
      },
      fail: () => {},
    });
  },

  // 外链跳转 linkUrl 默认链接;
  // linkUrlS=== "{"originalLink":"http:www.baidu.com.cn","linkType":"H5_LINK","linkName":"百度链接"}"
  // linkType链接类型:h5链接H5_LINK，支付宝小程序链接ZFB_APPLET_LINK，支付宝域内链接ZFB_LINK
  leaveMiniApp(linkUrl = "", linkUrlS = "{}") {
    try {
      setTimeout(() => {
        const linkUrlObj = JSON.parse(linkUrlS || "{}");
        console.log(linkUrlObj);
        const { linkType, originalLink = "", appId, pageIndex } = linkUrlObj;
        const decodeLinkUrl = decodeURIComponent(linkUrl);
        const rechargeUrl =
          "alipays://platformapi/startapp?appId=2021001107610820&page=pages/top-up/home/index";
        if (
          decodeLinkUrl.indexOf(rechargeUrl) === 0 ||
          decodeURIComponent(originalLink).indexOf(rechargeUrl) === 0
        ) {
          my.navigateToMiniProgram({
            appId: "2021001107610820", // 收藏有礼小程序的appid，固定值请勿修改
            path: "pages/top-up/home/index?sourceId=shop_866543608_cost12", // 收藏有礼跳转地址和参数
            extraData: {
              chInfo: "search",
            },
            success: (res) => {
              console.log(res);
            },
            fail: (error) => {
              // 跳转失败
              console.log(error);
            },
          });
          return;
        }
        if (
          (linkType === "H5_LINK" || linkType === "ZFB_LINK") &&
          originalLink
        ) {
          my.navigateToMiniProgram({
            appId: "2019061965581533", // 收藏有礼小程序的appid，固定值请勿修改
            path:
              "pages/index-coupon1/index-coupon?linkUrl=" +
              encodeURI(originalLink), // 收藏有礼跳转地址和参数
            success: (res) => {
              console.log(res);
            },
            fail: (error) => {
              // 跳转失败
              console.log(error);
            },
          });
          return;
        }
        if (linkType === "ZFB_APPLET_LINK" && appId && pageIndex) {
          console.log("2&&&&&&&&&&&");
          const { page, data = {} } = this.getUrlParamObject(pageIndex);
          my.navigateToMiniProgram({
            appId: appId, // 收藏有礼小程序的appid，固定值请勿修改
            path: page, // 收藏有礼跳转地址和参数
            extraData: data,
            success: (res) => {
              console.log(res);
            },
            fail: (error) => {
              // 跳转失败
              console.log(error);
            },
          });
          return;
        }
        if (linkUrl) {
          console.log(linkUrl);
          this.navigateTo(linkUrl);
        }
      }, 50);
    } catch (e) {
      console.log(e);
    }
  },

  getUrlParamObject(str = "") {
    str = decodeURIComponent(str);

    console.log(str);

    const keywordstr = "&query=";
    const list = str.split(keywordstr);
    const page = list[0];
    if (!list[1]) return { page };
    const arr = str.split(keywordstr)[1].split("&"); // 先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
    const obj = {};
    for (const i of arr) {
      obj[i.split("=")[0]] = i.split("=")[1]; // 对数组每项用=分解开，=前为对象属性名，=后为属性值
    }
    if (str.split("?").length === 1 && str.split("&").length === 2) {
      str = str.split("&")[0];
    }
    console.log(str);
    console.log(obj);
    return {
      page: str,
      data: obj,
    };
  },
  navigateTo(url = "") {
    my.navigateTo({
      url: url,
    });
  },
  goPageOnTap(e) {
    const { url } = e.target.dataset;
    my.navigateTo({
      url: url,
    });
  },
  encrypt(data = {}) {
    const key = CryptoJS.enc.Utf8.parse(_KEV);
    const iv = CryptoJS.enc.Utf8.parse(_IV);
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    });
    return encrypted.toString(); // 返回的是base64格式的密文
  },
  decrypt(encrypted) {
    var key = CryptoJS.enc.Utf8.parse(_KEV);
    var iv = CryptoJS.enc.Utf8.parse(_IV);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
  md5ForFy(content, time) {
    const SALT = "3afn4UpdQzENHhZji1jC";
    const s = content + SALT + time;
    return md5(s);
  },
});
