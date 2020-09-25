// pages/shopProfitDetail/shopProfitDetail.js
import http from '../../utils/api';
const event = require("../../utils/event.js");
const app = getApp();
Page({
  data: {
    tabArray:[
      {
        title:'余额总明细',
        dataType: 'E'
      }, {
        title: '积分总明细',
        dataType: 'F'
      }
    ],
    dataType: 'E',
    page: 1,
    list: [],
    pageSize: 10,
    hasMoreData: true,
    total:'',
    type: '',
    userInfo: {},
    isShowConfirm: false,
    isShowConfirm1: false,
    showModel1: false,
    bwjdNum: '',
    payInfo: {
      type: 'miniapp',
      password: ''
    },
  },

  onLoad: function (options) {
    let that = this
    that.setData({
      type: options.type
    })
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
    that.getList()
  },
  getUserInfo: function (options) {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        that.setData({
          userInfo: res.data,
          user_level: res.data.level.level
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getList()
    } else {
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  },
  getList: function () {
    let that = this
    let json = {}
    json.page = that.data.page
    if (that.data.type == 'point') {
        json.type = "E"
    }else if(that.data.type == 'money'){
        json.type = "C"
    }else if(that.data.type == 'baiWangJinDou'){
        json.type = "G"
    } else {
        json.type = "F"
    }
    http.shopProfitDetail({ // 调用接口，传入参数
      data: json,
      success: res => {
        if (res.data.list.length > 0) {
          var list1 = that.data.list;
          if (that.data.page == 1) {
            list1 = []
          }
          let list = res.data.list;
          if (list.length < that.data.pageSize) {
            that.setData({
              list: list1.concat(list),
              hasMoreData: false
            })
          } else {
            that.setData({
              list: list1.concat(list),
              hasMoreData: true,
              page: that.data.page + 1
            })
          }
        } else {
          that.setData({
            list: res.data.list,
            hasMoreData1: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  recharge(){
    var that = this
    that.setData({
      isShowConfirm: true,
      bwjdNum: ''
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
        showModel1: true
      })
    }
  },
  preventTouchMove(){
    let that = this
    that.setData({
      showModel1: false
    })
  },
  submit(){
    let that = this
    that.setData({
      showModel1: false
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