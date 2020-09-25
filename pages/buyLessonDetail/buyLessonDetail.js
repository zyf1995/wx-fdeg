// packageB/pages/buyLessonDetail/buyLessonDetail.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    order_id: '',
    orderDetail: {
      course:{

      },
      member:{

      }
    },
    upUrl: app.globalData.upUrl,
    fromPage: '',
    newOrder_id: ''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      order_id: options.order_id,
      fromPage: options.fromPage || ''
    })
    // that.getCourseDetail()
    console.log(that.data.fromPage)
  },
  onUnload: function () {
    var that = this
    if(that.data.fromPage == 'applyLesson'){
      wx.switchTab({
        url: '/pages/lessonList/lessonList'
      })
    }else{
      
    }
  },
  onShow: function () {
    let that = this
    that.getCourseDetail()
  },
  getCourseDetail: function () {
    let that = this
    http.courseOrderDetail({
      data: {
        order_id: that.data.order_id
      },
      success: res => {
        that.setData({
          orderDetail: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  selectedDate: function () {
    let that = this
    wx.navigateTo({
      url: '/pages/selectedLessonDate/selectedLessonDate?course_id=' + that.data.orderDetail.course_id + '&order_id=' + that.data.orderDetail.id + '&address=' + that.data.orderDetail.course.address + '&from=buyLessonDetail',
    })
  },
  payPanelS(){
    let that = this
    wx.showLoading({
      title: "正在调起支付···",
      mask: true
    })
    var json = {
      type: "miniapp",
      course_id: that.data.orderDetail.course.id,
      member_id: that.data.orderDetail.member.member_id,
      course_date_id: 0
    }
    if (that.data.newOrder_id) {
      json.order_id = that.data.newOrder_id
    }
    http.userCommitOrder({
      data: json,
      success: res => {
        wx.hideLoading()
        that.submit(res.data)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  submit: function (data) {
    let that = this
    wx.requestPayment({
      timeStamp: data.payinfo.timeStamp,
      nonceStr: data.payinfo.nonceStr,
      package: data.payinfo.package,
      signType: data.payinfo.signType,
      paySign: data.payinfo.paySign,
      success: function (res) {
        toast: {
          app.wxToast({
            title: '支付成功'
          })
        };
        wx.navigateTo({
          url: '/pages/selectedLessonDate/selectedLessonDate?course_id=' + that.data.payInfo.course_id + '&order_id=' + data.order_id + '&address=' + that.data.address + '&from=applyLesson',
        })
      },
      fail: function (err) {
        toast: {
          app.wxToast({
            title: '支付失败'
          })
        };
        that.setData({
          newOrder_id: data.order_num
        })
      }
    })
  }
})