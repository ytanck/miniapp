import { SUCESS_CODE } from "../../common/constance";
const { requestSubscribeMessage } = requirePlugin("subscribeMsg");

import { defineSort, formatDate, throttle } from "../../utils/tool";
const Alipay = require("/utils/alipay");
const config = require("/config.js");
const app = getApp();
Page({
  data: {},
  // 生命周期回调
  onLoad() {
    console.log(123, config);
  },
  onShow() {},

  // 全局分享配置
  onShareAppMessage() {},
});
