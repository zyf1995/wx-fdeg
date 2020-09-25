// pages/orderConfirm/orderConfirm.js
import http from '../../utils/api';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyInfo: {},
    info: {},
    cartOrder: '',
    payInfo: {
      type: 'alipay',
      remark: ''
    },
    shopRemarks: [],
    remarks: [],
    goodslist: [],
    is_virtual: '',
    birth: '',
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // that.data.buyInfo = JSON.parse(options.buyInfo)
    if (options.cartOrder) {
      that.data.info = JSON.parse(options.orderInfo);
      that.data.cartOrder = options.cartOrder;
      that.data.goodslist = JSON.parse(options.goodslist);
      that.setData({
        info: that.data.info,
        cartOrder: that.data.cartOrder,
        goodslist: that.data.goodslist
      })
      for(let i in that.data.info.goods_list){
        that.data.remarks.push('')
      }
    } else {
      that.data.buyInfo = JSON.parse(options.buyInfo)
      that.setData({
        is_virtual: options.is_virtual || 0
      })
      that.getInfo()
      console.log(that.data.is_virtual)
    }

  },
  bindDateChange: function(e) {
    this.setData({
      birth: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //更新本页面
  go_update() {
    let that = this
    console.log('我更新啦1111')
    that.getInfo()
  },
  goAddressList() {
    wx.navigateTo({
      url: '/pages/addressList/addressList?fromPage=orderConfirm'
    })
  },
  goAddressAdd() {
    wx.navigateTo({
      url: '/pages/addressAdd/addressAdd'
    })
  },
  getInfo: function () {
    let that = this
    http.mallBuyNow({ // 调用接口，传入参数
      data: that.data.buyInfo,
      success: res => {
        console.log('接口请求成功11', res)
        this.setData({
          info: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  updateValue: function (e) {
    let that = this;
    that.setData({
      remarks: e.detail.value
    })
    console.log(that.data.remarks)
  },

  // 店铺备注拼接
  shop_remark: function () {
    let that = this;
    that.data.shopRemarks = {};
    for (let i in that.data.info.goods_list) {
      let shops_id = that.data.info.goods_list[i].shops.id;
      that.data.shopRemarks[shops_id] = that.data.remarks;
    }
  },
  submit: function () {
    let that = this
    if (that.data.info.address == null) {
      toast: {
        app.wxToast({
          title: '请先添加收货地址'
        })
      };
      return false
    }
    that.data.payInfo.type = 'miniapp'
    if (that.data.buyInfo) {
      that.shop_remark();
      if (that.data.buyInfo.handle == 'buy' || that.data.buyInfo.handle == 'freeBuy') {
        that.data.payInfo.goods_id = that.data.info.goods_list[0].goods[0].goods_id;
        that.data.payInfo.goods_num = that.data.info.goods_list[0].goods[0].total_num;
        that.data.payInfo.goods_sku_id = that.data.buyInfo.goods_sku_id || '';
        that.data.costIntegral ? that.data.payInfo.score = 1 : that.data.payInfo.score = 0;
        that.data.payInfo.remark = that.data.shopRemarks
        that.setData({
          "payInfo.goods_id": that.data.payInfo.goods_id,
          "payInfo.goods_num": that.data.payInfo.goods_num,
          "payInfo.goods_sku_id": that.data.payInfo.goods_sku_id,
          "payInfo.score": that.data.payInfo.score,
          "payInfo.remark": that.data.payInfo.remark
        })
        console.log(that.data.payInfo.remark)
      }
    }
    if(that.data.is_virtual == 1){
      if(!that.data.birth){
        toast: {
          app.wxToast({
            title: '生辰八字不能为空！'
          })
        };
        return false
      }
      if(!that.data.date){
        toast: {
          app.wxToast({
            title: '生辰时间不能为空！'
          })
        };
        return false
      }
      that.data.payInfo.remark = '生辰八字:' + that.data.birth + ' ' + that.data.date
    }
    wx.showLoading({
      title: "正在调起支付···",
      mask: true
    })
    if (that.data.cartOrder) {
      that.shop_remark();
      let json = {
        goodslist: that.data.goodslist.join(','),
        remark: that.data.shopRemarks,
        type: "miniapp"
      }
      http.mallCartBuyNow2({
        data: json,
        success: res => {
          wx.hideLoading()
          if (res.code == 0) {
            toast: {
              app.wxToast({
                title: res.msg
              })
            };
          }
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
              wx.navigateTo({
                url: '/pages/orderList/orderList?dataType=all',
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
        },
        fail: err => {
          console.log(err)
        }
      })
    } else {
      http.mallBuyNowPay({
        data: that.data.payInfo,
        success: res => {
          wx.hideLoading()
          if (res.code == 0) {
            toast: {
              app.wxToast({
                title: res.msg
              })
            };
            return false
          }
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
              wx.navigateTo({
                url: '/pages/orderList/orderList?dataType=all',
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
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  }
})