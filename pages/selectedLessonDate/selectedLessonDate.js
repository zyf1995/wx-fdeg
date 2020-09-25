// packageB/pages/selectedLessonDate/selectedLessonDate.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    lessonDateList:[],
    course_id: '',
    date_id: '',
    address: '',
    order_id: '',
    from: ''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      course_id: options.course_id,
      order_id: options.order_id || '',
      address: options.address,
      from: options.from
    })
    that.getDateList()
  },
  onUnload: function () {
    let that = this
    if(that.data.from == 'applyLesson'){
      wx.switchTab({
        url: '/pages/lessonList/lessonList'
      })
      // wx.navigateTo({
      //   url: '/pages/buyLessonDetail/buyLessonDetail?order_id=' + that.data.order_id + '&fromPage=' + that.data.from,
      // })
    }
  },
  getDateList: function () {
    let that = this
    http.dateList({
      data: {
        course_id: that.data.course_id
      },
      success: res => {
        that.setData({
          lessonDateList: res.data,
          date_id: res.data[0].id
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  tabS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    that.setData({
      "date_id": item.id
    })
  },
  cancel: function () {
    let that = this
    wx.navigateTo({
      url: '/pages/buyLessonDetail/buyLessonDetail?order_id=' + that.data.order_id + '&fromPage=' + that.data.from,
    })
  },
  changeDate: function () {
    let that = this
    http.changeDate({
      data: {
        order_id: that.data.order_id,
        date_id: that.data.date_id
      },
      success: res => {
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if(res.code == 1){
          wx.navigateTo({
            url: '/pages/buyLessonDetail/buyLessonDetail?order_id=' + that.data.order_id + '&fromPage=' + that.data.from,
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})