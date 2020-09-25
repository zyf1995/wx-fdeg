// pages/orderInfo/orderInfo.js
import http from '../../utils/api';
const app = getApp();
Page({

  data: {
    id: '',
    info: {}
  },

  onLoad: function (options) {
    let that = this
    console.log(options)
    that.data.id = options.id
    that.getInfo()
  },
  getInfo: function () {
    let that = this
    http.mallOrderInfo({
      data: {
        id: that.data.id
      },
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          info: res.data.order
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  go_update: function () {
    let that = this
    console.log('更新啦')
    that.getInfo()
  },
  goOrderRefund: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/orderRefund/orderRefund?goodInfo=' + encodeURIComponent(JSON.stringify(item)) + '&type=' + type,
    })
  },
  toMallGoodsInfo: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodsInfo/goodsInfo?goodsId=' + id,
    })
  },
  cancelOrder: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '您确定要取消当前订单吗',
      success(res) {
        if (res.cancel) {
          console.log('用户点击了取消')
        } else if (res.confirm) {
          http.mallOrderCancel({
            data: {
              id: id
            },
            success: res => {
              console.log('接口请求成功', res)
              toast: {
                app.wxToast({
                  title: '取消成功'
                })
              };
              let pages = getCurrentPages();
              let beforePage = pages[pages.length - 2];
              beforePage.setData({
                txt: '取消成功'
              })
              beforePage.updateOrderList();
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
        }
      }
    })
  },
  orderReceived: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    http.mallOrderReceived({
      data: {
        id: id
      },
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: '收货成功'
          })
        };
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        beforePage.setData({
          txt: '收货成功'
        })
        beforePage.updateOrderListFinish();
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
  submit: function () {
    let that = this
    http.mallOrderPay({
      data: {
        id: that.data.id,
        type: "miniapp"
      },
      success: res => {
        console.log('接口请求成功', res)
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
              url: '/pages/orderList/orderList?dataType=delivery&status=2',
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
  },
  expressS: function () {
    let that = this
    let type = that.data.info.express_company.code;
    let postid = that.data.info.express_no;
    wx.navigateTo({
      url: '../../pages/detail/detail?type=' + type + '&postid=' + postid
    })
  }
})