import EventHub from 'iny-bus';
import { compare } from '../../utils/tool';
const app = getApp();
let countdownTimer = null;

Component({
    props: {
        config: {},
        floatMode: {},
        bannerList: [],
        bannerType: 'JIANGPINTANCHUANGDIBU_BANNER_CODE',
        QiangTiXingConfig: []
    },
    data: {
        phoneNum: '', // 电话号码
        name: '', // 用户姓名
        address: '', // 地址
        idCard: '', // 身份证
        hour: '01',
        minute: '59',
        second: '59',
        redPackageList: [
            {
                id: 1
            },
            {
                id: 2,

            },
            {
                id: 3,

            },
            {
                id: 4,

            },
            {
                id: 5,

            },
            {
                id: 6,

            },
            {
                id: 7,

            },
            {
                id: 8,

            }
        ],
        baseUrl: 'https://xiaojinhe-cdn.iyoudui.com/mouthGiftMiniApp/SCREQ-130/',
        canIUseShareButton: true, // 是否可以使用分享按钮
    },
    didMount () {
        const that = this;
        EventHub.remove('startTimer').on('startTimer', () => {
            that.startTimer();
        });
        const { config } = this.props;
        // console.log(config);
        // const bannerList = config.bannerConfig.filter((item) => {
        //     return item.position === 3 && item.isShow === 1;
        // }).sort(compare('sort'));
        // console.log('bannerList************');
        // console.log(bannerList);
        // this.setData({
        //     bannerList
        // });
        this.setShareButtonSwitch();
    },
    didUpdate (prevProps, prevData) {
        // console.log('prevProps====', prevProps);
    },
    deriveDataFromProps (nextProps) {

    },
    didUnmount () {
        clearInterval(countdownTimer);
        countdownTimer = null;
    },
    methods: {
        confirm (e) {
            const { floatMode } = this.props;
            const { phoneNum, name, address, idCard } = this.data;
            if (floatMode.prizeType === 4) {
                if (!this.regPhone(phoneNum)) {
                    my.showToast({
                        content: '请输入正确手机号',
                    });
                    return;
                }
            } else if (floatMode.prizeType === 5) {
                if (!this.regPhone(phoneNum)) {
                    if (name.length < 2) {
                        my.showToast({
                            content: '请填写正确的收货人姓名',
                        });
                        return;
                    }
                    my.showToast({
                        content: '请输入正确手机号',
                    });
                    return;
                }

                if (!address || address.length < 5) {
                    my.showToast({
                        content: '请填写正确的收货人地址',
                    });
                    return;
                }

                if (!idCard || !this.checkCard(idCard)) {
                    my.showToast({
                        content: '请填写正确的身份证号码',
                    });
                    return;
                }
            }
            this.props.onConfirm({ ...floatMode, phoneNum, name, address, idCard });
            this.setData({
                phoneNum: '', // 电话号码
                name: '', // 用户姓名
                address: '' // 地址
            });
        },
        cancel (e) {
            console.log(e)
            this.props.onCancel();
            // const { floatMode } = this.props;
            // this.props.onCancel({...floatMode})
        },
        phoneMode (e) {
            let phone = e.detail.value;
            if (phone.length >= 11) {
                phone = phone.substring(0, 11);
            }
            console.log(phone);
            this.setData({
                phoneNum: phone,
            });
        },
        nameMode (e) {
            const name = e.detail.value;
            this.setData({
                name
            });
        },
        addressMode (e) {
            const address = e.detail.value;
            this.setData({
                address
            });
        },
        idCardMode (e) {
            const idCard = e.detail.value;
            this.setData({
                idCard
            });
        },
        regPhone (phone) {
            const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (!myreg.test(phone)) {
                return false;
            } else {
                return true;
            }
        },
        // 校验身份证号
        checkCard: function (idCard) {
            // 15位和18位身份证号码的正则表达式
            const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

            // 如果通过该验证，说明身份证格式正确，但准确性还需计算
            if (idCard && regIdCard.test(idCard) && idCard.length == 18) {
                const idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10,
                    5, 8, 4, 2]; // 将前17位加权因子保存在数组里
                const idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
                let idCardWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
                for (let i = 0; i < 17; i++) {
                    idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                }

                const idCardMod = idCardWiSum % 11;// 计算出校验码所在数组的位置
                const idCardLast = idCard.substring(17);// 得到最后一位身份证号码

                // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if (idCardMod == 2) {
                    if (idCardLast == 'X' || idCardLast == 'x') {
                        // alert("恭喜通过验证啦！");
                        return true;
                    } else {
                        my.showToast({
                            type: 'none',
                            content: '请输入正确的身份证',
                            duration: 2000,
                        });
                        return false;
                    }
                } else {
                    // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if (idCardLast == idCardY[idCardMod]) {
                        // alert("恭喜通过验证啦！");
                        return true;
                    } else {
                        my.showToast({
                            type: 'none',
                            content: '请输入正确的身份证',
                            duration: 2000,
                        });
                        return false;
                    }
                }
            } else {
                my.showToast({
                    type: 'none',
                    content: '请输入正确的身份证',
                    duration: 2000,
                });
                return false;
            }
        },
        countTime (endDate) {
            const that = this;
            const date = new Date();
            const now = date.getTime();
            const end = endDate.getTime();
            const leftTime = end - now; // 时间差
            let h, m, s, ms;
            let isEnd = false;
            if (leftTime >= 0) {
                // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60 % 2);
                // console.log(h);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                ms = Math.floor(leftTime % 1000);
                if (ms < 100) {
                    ms = '0' + ms;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                if (h < 10) {
                    h = '0' + h;
                }
            } else {
                console.log('已截止');
                clearInterval(countdownTimer);
                countdownTimer = null;
                h = '00';
                m = '00';
                s = '00';
                ms = '00';
                isEnd = true;
            }
            // 将倒计时赋值到div中
            that.setData({
                isEnd,
                // day: d,
                hour: h,
                minute: m,
                second: s,
            });
        },
        startTimer () {
            clearInterval(countdownTimer);
            const endDate = new Date();// 设置截止时间
            endDate.setDate(endDate.getDate() + 2);
            countdownTimer = setInterval(() => {
                this.countTime(endDate);
            }, 1000);
        },
        clerTimer () {
            clearInterval(countdownTimer);
            countdownTimer = null;
        },
        bannerClick (e) { // banner埋点
            const { url, name, index, item } = e.target.dataset;
            const json = {
                spm_value: 'a27.p173.m396.b549',
                action: '1',
                other: {
                    index: String(parseInt(index) + 1),
                    item_name: name || '',
                    ext_0: String(parseInt(index) + 1),
                    ext_1: name || '',
                    source_url: url
                }
            };
            // app.maidianFn(json);
            app.leaveMiniApp(url, item.linkUrlS, json);
        },
        imageLoad () {
            this.props.onImageLoad();
        },
        // 设置按钮是否可以分享
        setShareButtonSwitch () {
            this.setData({
                canIUseShareButton: my.canIUse('button.open-type.share')
            });
        },
    }
});
