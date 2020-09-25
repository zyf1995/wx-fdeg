// pages/groupShopDetail/groupShopDetail.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    goods_id: '',
    groupGoodsDetail: {},
    current: 0,
    buyInfo: {
      goods_id: '',
      goods_num: 1,
      goods_sku_id: '',
      handle: 'buy',
      goods_stock: 0,
      goods_price: 0,
      line_price: 0
    },
    hideModal: true,
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      goods_id: options.goods_id
    })
    that.getGroupGoodsDetail()
  },
  swiperChange: function (e) {
    var that = this;
    that.setData({
      current: e.detail.current
    })
  },
  getGroupGoodsDetail: function () {
    let that = this
    http.groupGoodsDetail({ // 调用接口，传入参数
      data: {
        goods_id: that.data.goods_id
      },
      success: res => {
        that.setData({
          groupGoodsDetail: res.data,
          "buyInfo.goods_id": res.data.goods_id,
          "buyInfo.goods_stock": res.data.stock,
          "buyInfo.goods_price": res.data.price
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  // 显示遮罩层
  cartPanelS: function (e) {
    var that = this;
    if (!loginCheck.toLoginCheck()) {
      return false
    }
    let type = e.target.dataset.type
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 400)
    that.setData({
      "buyInfo.handle": type
    })
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 400)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  attrComputed: function (e) {
    let that = this
    let type = e.target.dataset.type
    let buyInfo = JSON.stringify(that.data.buyInfo)
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation
    that.fadeDown();
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 400)
    wx.navigateTo({
      url: '/pages/groupOrderConfirm/groupOrderConfirm?buyInfo=' + buyInfo,
    })
  }
})