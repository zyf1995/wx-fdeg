// pages/bindBank/bindBank.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    bankNameList: [
        '中国建设银行',
        '中国光大银行',
    ],
    bankListShow: false,
    userInfo: {},
      sendable: true,
    info: {
        number: 60,
        mobile: '',
        code: '',
        bank_name: '',
        bank_subname: '',
        bank_username: '',
        bank_card: '',
        type: 'bank',
        handle: 'bind'
    },
    show:false,
    index:0
  },
  onLoad: function (options) {
    let that = this
    that.getUserInfo()
    that.getBankList()
    that.getInfo()
  },
  // 点击下拉显示框
  selectTap(){
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e){
    let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index:Index,
      show:!this.data.show
    });
  },
  getUserInfo: function () {
    let that = this
    http.userInfo({
      data:{},
      success: res => {
        that.setData({
          userInfo: res.data,
          "info.mobile": res.data.mobile
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getBankList(){
    let that = this
    http.bank_list({
      data:{},
      success: res => {
        that.setData({
          bankNameList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getInfo(){
    let that = this
    http.bindAlipay({
      data:{},
      success: res => {
        if(res.data){
          that.setData({
            "info.bank_name": res.data.bank_name,
            "info.bank_subname": res.data.bank_subname,
            "info.bank_card": res.data.bank_card,
            "info.bank_username": res.data.bank_username
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  bankS(){
    this.data.bankListShow = !this.data.bankListShow
    this.setData({
      bankListShow: this.data.bankListShow
    })
  },
  bankNameS(e){
    let that = this
    let item = e.currentTarget.dataset.item
    that.setData({
      "info.bank_name": item,
      bankListShow: false
    })
  },
  updateValue(e){
    let that = this
    let type = e.currentTarget.dataset.type
    if(type == 'mobile'){
      that.setData({
        "info.mobile": e.detail.value
      })
    } else if (type == 'code'){
      that.setData({
        "info.code": e.detail.value
      })
    } else if (type == 'bank_subname') {
      that.setData({
        "info.bank_subname": e.detail.value
      })
    } else if (type == 'bank_card') {
      that.setData({
        "info.bank_card": e.detail.value
      })
    } else if (type == 'bank_username') {
      that.setData({
        "info.bank_username": e.detail.value
      })
    }
  },
  sendMsg: function () {
    let that = this;
    if (!that.data.info.mobile || !loginCheck.mobileVerify(that.data.info.mobile)) {
      toast: {
        app.wxToast({
          title: "请输入正确的账号"
        })
      };
      return false
    }
    http.sendSms({
      data: {
        mobile: that.data.info.mobile,
        event: 'band_account'
      },
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        that.countDown()
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  countDown: function () {
    var that = this;
    that.setData({
      sendable: false,
      "info.number": 60
    })
    var timer1 = setInterval(function () {
      if (that.data.info.number == 0) {
        clearInterval(timer1);
        that.setData({
          sendable: true
        })
      } else {
        that.data.info.number--
        that.setData({
          "info.number": that.data.info.number
        })
      }

    }, 1000)
  },
  bind: function () {
    var that = this
    if (!that.data.info.bank_name) {
      toast: {
        app.wxToast({
          title: "请填写银行名称"
        })
      };
      return false
    }
    if (!that.data.info.bank_card) {
      toast: {
        app.wxToast({
          title: "请填写银行卡账号"
        })
      };
      return false
    }
    if (!that.data.info.code) {
      toast: {
        app.wxToast({
          title: "请填写验证码"
        })
      };
      return false
    }
    if (!that.data.info.bank_username) {
      toast: {
        app.wxToast({
          title: "请填写开户姓名"
        })
      };
      return false
    }
    http.bindAlipay1({
      data: that.data.info,
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
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
      },
      fail: err => {
        console.log(err)
      }
    })
  },
})