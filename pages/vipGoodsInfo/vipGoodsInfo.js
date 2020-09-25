// pages/vipGoodsInfo/vipGoodsInfo.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    hideModal: true, 
    animationData: {},
    goods_id: '',
    goodsInfo: {},
    buyInfo: {
      goods_id: '',
      goods_num:1,
      goods_sku_id: '',
      handle: 'buy',
      goods_stock: 0,
      goods_price: 0,
      line_price: 0,
  },
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      goods_id: options.goodsid
    })
    that.getGoodsInfo()
  },
  getGoodsInfo(){
    let that = this
    http.mallGoodsInfo({ 
      data: {
        goods_id: that.data.goods_id
      },
      success: res => {
        that.setData({
          goodsInfo: res.data,
          "buyInfo.goods_id":  res.data.detail.goods_id,
          "buyInfo.goods_stock": res.data.detail.spec[0].stock_num,
          "buyInfo.goods_price": res.data.detail.spec[0].goods_price,
          "buyInfo.line_price": res.data.detail.spec[0].line_price
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
      "buyInfo.handle": type,
      buyType: type
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
  changeNum: function (e) {
    let that = this
    let type = e.target.dataset.type
    if (type == 'minus') {
      if (that.data.buyInfo.goods_num == 1) {
        toast: {
          app.wxToast({
            title: "不能再少啦"
          })
        };
        return false;
      } else {
        let goods_num = that.data.buyInfo.goods_num
        goods_num--
        that.setData({
          "buyInfo.goods_num": goods_num
        })
      }
    } else {
      if (that.data.buyInfo.goods_num > that.data.buyInfo.goods_stock) {
        toast: {
          app.wxToast({
            title: "只能买这么多了"
          })
        };
        return false;
      } else {
        let goods_num = that.data.buyInfo.goods_num
        goods_num++
        that.setData({
          "buyInfo.goods_num": goods_num
        })
        console.log(that.data.buyInfo.goods_num)
      }
    }
  },
  attrComputed: function () {
    let that = this
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
      url: '/pages/orderConfirm/orderConfirm?buyInfo=' + buyInfo,
    })
  }
})