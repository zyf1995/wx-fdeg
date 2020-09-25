// pages/withdraw/withdraw.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    userInfo: {},
    info: {
      num: '',
      type: 'alipay'
    },
    isAlipay: '',
    isBank:'',
    withdraw_min: '',
    money: ''
  },
  onLoad: function (options) {
    let that = this
    that.getInfo()
  },
  updateValue: function (e) {
    let that = this
    that.setData({
      "info.num": e.detail.value
    })
  },
  typeS(e){
    let type = e.currentTarget.dataset.type
    console.log(type)
    this.setData({
      "info.type": type
    })
  },
  getInfo: function () {
    let that = this
    http.userWithdraw({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          isAlipay: res.data.alipay,
          isBank: res.data.bank,
          money: res.data.money,
          withdraw_min: res.data.withdraw_min
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  goBindAlipay: function () {
    let that = this
    wx.navigateTo({
      url: '/pages/bindAlipay/bindAlipay',
    })
  },
  goBindBank(){
    wx.navigateTo({
      url: '/pages/bindBank/bindBank',
    })
  },
  //更新本页面
  go_update() {
    let that = this
    console.log('我更新啦')
    that.getInfo()
  },
  submit: function () {
    var that = this;
    if (!that.data.info.num) {
      toast: {
        app.wxToast({
          title: "请输入提现金额"
        })
      };
      return false;
    }
    if(that.data.info.type == 'alipay'){
      if (that.data.isAlipay == false) {
        toast: {
          app.wxToast({
            title: "请先绑定支付宝"
          })
        };
        return false;
      }
    }else if(that.data.info.type == 'bank'){
      if (that.data.isBank == false) {
        toast: {
          app.wxToast({
            title: "请先绑定银行卡"
          })
        };
        return false;
      }
    }
    http.userWithdraw1({
      data: {
        num: that.data.info.num,
        type: that.data.info.type
      },
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if(res.code == 1){
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          beforePage.setData({
            txt: '修改数据了'
          })
          beforePage.go_update();
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})