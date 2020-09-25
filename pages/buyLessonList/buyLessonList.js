// pages/buyLessonList/buyLessonList.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    tabArray: [{
      title: '全部',
      status: 'all'
    }, {
      title: '待确定',
      status: '40'
    }, {
      title: '待上课',
      status: '10'
    }, {
      title: '已完成',
      status: '20'
    }],
    status:'all',
    page: 1,
    orderList:[]
  },
  onLoad: function (options) {
    let that = this
    that.getList('正在加载数据...')
  },
  tabS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      status: item.status,
      page: 1
    })
    that.getList('正在加载数据...')
  },
  getList: function (message) {
    var that = this
    wx.showNavigationBarLoading()
    wx.showLoading({							
      title: message,
    })
    var json = {
      order_status: that.data.status
    }
    http.courseOrder_list({ // 调用接口，传入参数
      data: json,
      success: res => {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        that.setData({
          orderList: res.data
        })
        that.countdown()
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  countdown(){
    var that = this
      for (var i = 0; i < that.data.orderList.length; i++){
        var date = new Date();
        var now = date.getTime();
        if (now < that.data.orderList[i].start_time*1000){
          var t = that.data.orderList[i].start_time*1000 - now
          var day = Math.floor(t / 86400000)
          var hour = Math.floor((t / 3600000) % 24)
          var min = Math.floor((t / 60000) % 60)
          var sec = Math.floor((t / 1000) % 60)
          hour = hour < 10 ? '0' + hour : hour
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          var format = ''
          format = `<div class="fontSize12">还剩<span class="color_ff5">${day}</span>天<span class="color_ff5">${hour}</span>小时
          <span class="color_ff5">${min}</span>分<span class="color_ff5">${sec}</span>秒</div>`
          // that.data.orderList[i].start_time = format
          var start_time = "orderList[" + i + "].start_time"
          that.setData({
            [start_time]: format
          })
        }else {
          var format = ''
          format = `<div class="fontSize12">课程已结束</div>`
          var start_time = "orderList[" + i + "].start_time"
          that.setData({
            [start_time]: format
          })
        }
      }
  },
  buyLessonDetail: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if (item.order_status == 40) {
      wx.navigateTo({
        url: '/pages/applyLesson/applyLesson?course_id=' + item.course_id + '&order_id=' + item.order_num + '&address=' + item.address + '&is_first=20&second_price=' + item.price,
      })
    }else {
      wx.navigateTo({
        url: '/pages/buyLessonDetail/buyLessonDetail?order_id=' + item.id + '&fromPage=buyLessonList',
      })
    }
  }
})