// pages/shopTeamOrder/shopTeamOrder.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    status: 'all',
    tabArraySub: [{
      title: '全部',
      status: 'all'
    }, {
      title: '已付款',
      status: 1
    }, {
      title: '已结算',
      status: 3
    }, {
      title: '已失效',
      status: -1
    }],
    subScrollLeft: 'translateX(0%)',
    list: [],
    page: 1,
    hasMoreData: true,
    pageSize: 10
  },

  onLoad: function (options) {
    let that = this
    that.getList()
  },
  onReachBottom: function () {
    var that = this
    if (that.data.hasMoreData) {
      var page = that.data.page + 1
      that.setData({
        page: page
      })
      that.getList('scrolltobottom')
    } else {
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  }, 
  tabS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      status: item.status,
      subScrollLeft: 'translateX(' + index * 100 + '%)',
      page: 1
    })
    that.getList()
  },
  getList: function (type) {
    let that = this
    http.shopMallTeamorder({ // 调用接口，传入参数
      data: {
        status: that.data.status,
        page: that.data.page
      },
      success: res => {
        console.log('shopMallTeamorder', res)
        if (type == 'scrolltobottom') {
          var arr1 = that.data.list
          var arr2 = res.data
          arr1 = arr1.concat(arr2)
          that.setData({
            list: arr1
          })
          if (res.data.length == 0) {
            that.setData({
              hasMoreData: false
            })
          }
        } else {
          that.setData({
            list: res.data
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  copy: function (e) {
    let that = this;
    let orderno = e.currentTarget.dataset.orderno
    wx.setClipboardData({
      data: orderno,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})