// pages/fightOrderList/fightOrderList.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const event = require("../../utils/event.js");
const app = getApp();
Page({
  data: {
    goodsList:[],
    keywords: '',
    switchChecked: false,
    logList: [],
    animate: false,
    swiperImg: [],
    logList1:[],
    userInfo:{},
    timer: null,
    isShow: 1,
    isShowConfirm: false,
    isShowConfirm1: false,
    showModel: false,
    bwjdNum: '',
    payInfo: {
      type: 'miniapp',
      password: ''
    },
  },
  onLoad: function (options) {
    let that = this
    if (options.scene) {
      let getQueryString = {}
      let strs = decodeURIComponent(options.scene).split('&')
      for (var i = 0; i < strs.length; i++) {
        getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
      wx.setStorage({
        key: 'pid',
        data: getQueryString['pid']
      })
    } else {
      wx.setStorage({
        key: 'pid',
        data: options.pid || ''
      })
    }
    that.getList()
    that.getLog()
    that.getReward()
    that.getSwiperImg()
    that.fightListShow()
    event.$on({
      name:"updateUserInfo",
      tg:this,
      success:(res)=>{
        console.log("收到消息了-------",res);
        that.getUserInfo()
      }
    })
    // if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    // }else{
    //   that.getUserInfo()
    // }
  },
  onShow(){
    var that = this
    that.getUserInfo()
    that.isSwitch()
    let timer = setInterval(function(){
      that.showMarquee();
    },2000)
    that.setData({
      timer: timer
    })
  },
  onHide(){
    clearInterval(this.data.timer)
  },
  getUserInfo: function (options) {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        that.setData({
          userInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: (this.data.userInfo.nickname || this.data.userInfo.mobile) + '邀请你加入丰德E购！',
      path: '/pages/fightOrderList/fightOrderList?pid=' + this.data.userInfo.id,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onPullDownRefresh() {
    let that = this
    that.getList()
    that.isSwitch()
    that.fightListShow()
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
    wx.stopPullDownRefresh()
  },
  goShopProfit: function () {
    if(!loginCheck.toLoginCheck()){
      return false
    }
    wx.navigateTo({
      url: '/pages/shopProfitDetail/shopProfitDetail?type=baiWangJinDou',
    })
  },
  fightListShow(){
    let that = this
    http.fightListShow({
      data: {},
      success: res => {
        that.setData({
          isShow: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  showMarquee: function() {
    var that = this;
    that.setData({
      animate: true
    })
    that.data.logList.push(that.data.logList[0]);
    that.data.logList.shift();
    that.data.logList1.push(that.data.logList1[0]);
    that.data.logList1.shift();
    that.setData({
      logList: that.data.logList,
      logList1: that.data.logList1,
      animate: false
    })
  },
  getLog(){
    let that = this
    http.get_log({ 
      data: {},
      success: res => {
        that.setData({
          logList: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getReward(){
    let that = this
    http.get_reward({ 
      data: {},
      success: res => {
        that.setData({
          logList1: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getSwiperImg(){
    let that = this
    http.get_poster({ 
      data: {},
      success: res => {
        that.setData({
          swiperImg: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  isSwitch(){
    let that = this
    http.is_switch({
      data: {},
      success: res => {
        if(res.data == 10){
          that.setData({
            switchChecked: false,
            checked: false
          })
        }else{
          that.setData({
            switchChecked: true,
            checked: true
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  switchChange(e){
    let that = this
    let checked = e.detail.value
    that.setData({
      checked: checked
    })
    let json = {}
    if(checked){
      json.swith = 20
    }else{
      json.swith = 10
    }
    http.edit_switch({
      data: json,
      success: res => {
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if(res.code == 0){
          that.setData({
            switchChecked: false,
            checked: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getList(){
    let that = this
    http.getgoodslist({
      data: {
        key_word: that.data.keywords
      },
      success: res => {
        that.setData({
          goodsList: res.data.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  toGoodsInfo(e){
    let that = this
    let id = e.currentTarget.dataset.id
    let goodsid = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/fightOrderDetail/fightOrderDetail?id=' + id + '&goodsid=' + goodsid,
    })
  },
  goMyOrderList(){
    if(!loginCheck.toLoginCheck()){
      return false
    }
    wx.navigateTo({
      url: '/pages/fightingOrderList/fightingOrderList',
    })
  },
  goRankList(){
    if(!loginCheck.toLoginCheck()){
      return false
    }
    wx.navigateTo({
      url: '/pages/rankList/rankList',
    })
  },
  recharge(){
    var that = this
    if(!loginCheck.toLoginCheck()){
      return false
    }
    that.setData({
      isShowConfirm: true,
      bwjdNum: '',
      "payInfo.password": ''
    })
  },
  setValue: function (e) {
    this.setData({
      bwjdNum: e.detail.value.replace(/[^\d]/g,'')
    })
  },
  setValue1: function (e) {
    this.setData({
      "payInfo.password": e.detail.value
    })
  },
  payTypeS(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      "payInfo.type": type
    })
  },
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
      isShowConfirm1: false,
    })
  },
  confirmAcceptance:function(){
    var that = this
    if(!that.data.bwjdNum || that.data.bwjdNum == 0){
      toast: {
        app.wxToast({
          title: '充值数量不能为空'
        })
      };
    }else{
      that.setData({
        isShowConfirm: false,
        showModel: true
      })
    }
  },
  preventTouchMove(){
    let that = this
    that.setData({
      showModel: false
    })
  },
  submit(){
    let that = this
    that.setData({
      showModel: false
    })
    if(that.data.payInfo.type == 'money'){
      that.setData({
        isShowConfirm1: true
      })
    }else{
      wx.showLoading({
        title: "正在调起支付···",
        mask: true
      })
      that.pay()
    }
  },
  confirmRecharge:function(){
    var that = this
    if (!that.data.payInfo.password) {
      toast: {
        app.wxToast({
          title: '请输入支付密码'
        })
      };
      return false;
    }
    that.pay()
  },
  pay(){
    var that = this
    let json = {
      num: that.data.bwjdNum,
      type: that.data.payInfo.type
    }
    if (that.data.payInfo.type == 'money') {
      json.password = that.data.payInfo.password
    }
    http.recharge({
      data: json,
      success: res => {
        if(that.data.payInfo.type == 'miniapp'){
          wx.hideLoading()
        }
        if(res.code == 1){
          if(that.data.payInfo.type == 'miniapp'){
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: function (res) {
                toast: {
                  app.wxToast({
                    title: '支付成功'
                  })
                };
                that.setData({
                  isShowConfirm1: false,
                  page: 1
                })
                that.getList()
                that.getUserInfo()
                event.$emit({
                  name: "updateUserInfo",
                  data: "百旺金豆充值成功"
                })
              },
              fail: function (err) {
                toast: {
                  app.wxToast({
                    title: '支付失败'
                  })
                };
              }
            })
          }else if(that.data.payInfo.type == 'money'){
            toast: {
              app.wxToast({
                title: '支付成功'
              })
            };
            that.setData({
              isShowConfirm1: false,
              page: 1
            })
            that.getList()
            that.getUserInfo()
            event.$emit({
              name: "updateUserInfo",
              data: "百旺金豆充值成功"
            })
          }
        }else{
          toast: {
            app.wxToast({
              title: res.msg
            })
          };
        }
      },
      fail: err => {
        console.log(err)
      }
    }) 
  }
})