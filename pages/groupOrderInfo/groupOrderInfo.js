// pages/groupOrderInfo/groupOrderInfo.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    id: '',
    status: '',
    info: {}
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      status: options.status,
      id: options.id
    })
    console.log(options.status)
    that.getInfo()
  },
  getInfo(){
    let that = this
    http.groupOrder_detail({
      data: {
        id: that.data.id,
        type: that.data.status
      },
      success: res => {
        that.setData({
          info: res.data.order
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  orderReceived: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    http.groupOrder_finish({
      data: {
        id: id
      },
      success: res => {
        if(res.code == 1){
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
  },
  expressS: function () {
    let that = this
    let type = that.data.info.express_company;
    let postid = that.data.info.express_no;
    wx.navigateTo({
      url: '/pages/detail/detail?type=' + type + '&postid=' + postid
    })
  }
})