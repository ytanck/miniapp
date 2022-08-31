/**
 *封装alipay api
 *
 * @class Alipay
 */
class Alipay {
  /**
   * 同步获取storage
   * @param {string} key
   */
  static getStorageSync(key) {
    const { data = {} } = my.getStorageSync({ key }) || {};
    return data == null ? {} : data;
  }

  /**
   * 异步获取storage
   * @param {string} key
   */
  static async getStorage(key) {
    const { data = {} } = await new Promise((resolve, reject) => {
      my.getStorage({
        key,
        success: resolve,
        fail: reject,
      });
    });
    return data == null ? {} : data;
  }

  /**
   *存储 storage
   *
   * @static
   * @param {*} key
   * @param {*} data
   * @memberof Alipay
   */
  static setStorageSync(key, data) {
    Object.assign(data, {
      // 添加时间戳
      time: new Date().getTime(),
    });
    my.setStorageSync({
      key,
      data,
    });
  }

  /**
   *异步存储 storage
   *
   * @static
   * @param {*} key
   * @param {*} data
   * @memberof Alipay
   */
  static setStorage(key, data) {
    Object.assign(data, {
      // 添加时间戳
      time: Date.now(),
    });
    return new Promise((resolve, reject) => {
      my.setStorage({
        key,
        data,
        success: resolve,
        fail: reject,
      });
    });
  }

  /**
   *移除storage
   *
   * @static
   * @param {*} key
   * @memberof Alipay
   */
  static removeStorageSync(key) {
    my.removeStorageSync({
      key,
    });
  }

  /**
   *移除storage
   *
   * @static
   * @param {*} key
   * @memberof Alipay
   */
  static removeStorage(key) {
    my.removeStorage({
      key,
    });
  }

  /**
   * 判断用户是否收藏了小程序
   */
  static isFavorite() {
    return new Promise((resolve, reject) => {
      my.isFavorite({
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  /**
   * 收藏小程序
   */
  static addToFavorite() {
    return new Promise((resolve, reject) => {
      my.addToFavorite({
        bizType: "P_RPC_2018092561507369_YIDONGTEQUAN",
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  // 获取系统信息
  static getSystemInfo() {
    return new Promise((resolve, reject) => {
      my.getSystemInfo({
        success(res) {
          resolve(res);
        },
      });
    });
  }

  static getLocationInfo() {
    return new Promise((resolve, reject) => {
      my.getLocation({
        success(res) {
          resolve({ lon: res.longitude, lat: res.latitude });
        },
        fail() {
          resolve({ lon: null, lat: null });
        },
      });
    }).catch(() => {
      my.showToast({
        content: "哎呀！获取地理位置失败",
      });
    });
  }
  // 跳转判断
  static turnPage(url) {
    setTimeout(() => {
      if (
        url.indexOf("../") === 0 ||
        url.indexOf("/pages") === 0 ||
        url.indexOf("/packageList") === 0
      ) {
        my.navigateTo({
          url,
        });
      } /* ( url.indexOf("alipays://") === 0)  */ else {
        my.navigateToMiniProgram({
          appId: "2019061965581533", // 收藏有礼小程序的appid，固定值请勿修改
          path: "pages/index-coupon1/index-coupon?linkUrl=" + encodeURI(url), // 收藏有礼跳转地址和参数
          success: (res) => {
            console.log(res);
          },
          fail: (error) => {
            // 跳转失败
            console.log("跳转失败", error);
          },
        });
      }
      // else{
      //     my.navigateTo({
      //         // encodeURIComponent()
      //         url: `/pages/webview1/webview1?url=${encodeURIComponent(url)}`
      //     })
      // }
    }, 50);
  }
}

export default Alipay;
