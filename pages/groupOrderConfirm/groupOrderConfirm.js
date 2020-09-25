// pages/groupOrderConfirm/groupOrderConfirm.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    buyInfo: {},
    info: {},
    payInfo: {
      type: 'alipay',
      remark: ''
    },
    shopRemarks: [],
    remarks: [],
    goodslist: []
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      buyInfo: JSON.parse(options.buyInfo)
    })
    that.getInfo()
  },
  go_update() {
    let that = this
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
    http.groupGoods_buyNow({ // 调用接口，传入参数
      data: {
        goods_id: that.data.buyInfo.goods_id,
        goods_num: that.data.buyInfo.goods_num
      },
      success: res => {
        this.setData({
          info: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  submit(){
    wx.navigateTo({
      url: "/pages/groupOrderList/groupOrderList?dataType1=all&status=total",
    })
  },
  submit1: function () {
    let that = this
    if (that.data.info.address == null) {
      toast: {
        app.wxToast({
          title: '请先添加收货地址'
        })
      };
      return false
    }
    wx.showLoading({
      title: "正在调起支付···",
      mask: true
    })
    http.group_buyNow_pay({
      data: {
        goods_id: that.data.buyInfo.goods_id,
        goods_num: that.data.buyInfo.goods_num,
        address_id: that.data.info.address.address_id,
        type: 'miniapp'
      },
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
              url: '/pages/groupOrderList/groupOrderList?dataType1=all&status="total"',
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
})