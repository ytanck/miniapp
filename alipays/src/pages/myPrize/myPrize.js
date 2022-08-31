const Alipay = require("/utils/alipay");
const config = require("/config.js");
const app = getApp();
Page({
  data: {},
  // 生命周期回调
  onLoad(query) {
    console.log("query11", query);
  },
  onShow() {},
  // 全局分享配置
  onShareAppMessage() {},
});
