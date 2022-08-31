import { throttle } from "/utils/tool";
import { userClickAdBill, D2V_LOG } from "../../apis/api";
const app = getApp();
Component({
  data: {
    // 组件内部数据
    // indicatorDots: true,
    autoplay: true,
    vertical: false,
    interval: 4000,
    circular: true,
    visitFlags: [],
  },
  props: {
    pageShow: true, //是否显示组件初，后续始化组件
    bannerList: [],
    width: "690rpx",
    height: "170rpx",
    // onBannerClickProps: () => {}, //点击事件回传
    // onBannerVisitProps: () => {}, //曝光事件回传
  },
  didMount() {
    this.initBanner();
  },

  deriveDataFromProps(nextProps) {},
  methods: {
    // 自定义方法
    initBanner() {
      if (this.props.bannerList && this.props.bannerList.length) {
        this.data.visitFlags = this.props.bannerList.map((item) => false);
        this.bannerItemVisitBuryData(0);
      }
    },
    onBannerItemChange(e) {
      if (!this.props.pageShow) return false;

      const { current } = e.detail;
      this.bannerItemVisitBuryData(current);
    },

    bannerItemVisitBuryData(index) {
      if (this.data.visitFlags[index]) return false;
      const item = this.props.bannerList[index];

      // const json = {
      //   spm_value: item.spm,
      //   action: "3",
      //   other: {
      //     ext_0: app.globalData.acCode, // "活动ID"
      //     ad_idea_id: item.ideaId,
      //     ad_unit_id: item.sceneCode,
      //     source_url: item.ideaUrl
      //       ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || ""
      //       : "",
      //     site_id: index + 1,
      //   },
      // };
      const json1 = {
        spm_value: item.spm,
        channel: app.globalData.channel,
        action: "3",
        events: {
          ad_exposure: {
            ad_unit_id: item.sceneCode,
            ad_idea_id: item.ideaId,
            ad_spm_value: item.spm,
            source_url: item.ideaUrl
              ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || ""
              : "",
            item_text: "",
          },
        },
      };

      this.data.visitFlags[index] = true;
      D2V_LOG(json1); //app.maidianFn(json);
      // this.props.onBannerVisitProps && this.props.onBannerVisitProps({ item, index });
    },
    handleClickItem: throttle(function (e) {
      const { item, index } = e.target.dataset;
      console.log("111111", item);
      // const json = {
      //   spm_value: item.spm,
      //   action: "1",
      //   other: {
      //     ext_0: app.globalData.acCode,
      //     ad_idea_id: item.ideaId,
      //     ad_unit_id: item.sceneCode,
      //     source_url: item.ideaUrl
      //       ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || ""
      //       : "",
      //     site_id: index + 1,
      //   },
      // };
      const json1 = {
        spm_value: item.spm,
        channel: app.globalData.channel,
        action: "1",
        events: {
          ad_exposure: {
            ad_unit_id: item.sceneCode,
            ad_idea_id: item.ideaId,
            ad_spm_value: item.spm,
            source_url: item.ideaUrl
              ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || ""
              : "",
            item_text: "",
          },
        },
      };

      D2V_LOG(json1); //app.maidianFn(json);
      // this.props.onBannerClickProps && this.props.onBannerClickProps({ item, index });

      // 星火banner上报  isNotice === '1' 并且跳转地址存在
      const goUrl = item.ideaUrl
        ? item.ideaUrl.viewUrl || item.ideaUrl.originalLink || ""
        : "";
      if (item.isNotice === "1" && goUrl) {
        userClickAdBill(
          {
            sceneCode: item.sceneCode,
            operation: "click",
            sceneGroupCode: item.sceneGroupCode,
            uid: app.globalData.zfbUid || "",
            nth: item.nth,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      }
      setTimeout(() => {
        app.leaveMiniApp("", JSON.stringify(item.ideaUrl));
      }, 50);
    }, 1000),
  },
});
