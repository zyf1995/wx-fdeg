// packageB/pages/applyLesson/applyLesson.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    hasPersonMsg: false,
    lessonMemberLists:[],
    userInfo: {},
    first_price: '',
    second_price: '',
    is_first: '',
    order_id: '',
    payInfo: {
      type: 'miniapp',
      course_id: '',
      member_id: '',
      course_date_id: 0
    },
    is_second: false
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      "payInfo.course_id": options.course_id,
      first_price: options.first_price,
      second_price: options.second_price,
      order_id: options.order_id || '',
      address: options.address,
      is_first: options.is_first
    })
    console.log(JSON.stringify(options))
    that.getLessonMemberLists()
    that.getUserInfo()
  },
  getUserInfo: function () {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        that.setData({
          userInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  tabS: function (){
    let that = this
    that.data.is_second = !that.data.is_second
    that.setData({
      is_second: that.data.is_second
    })
  },
  go_update: function () {
    let that = this
    that.getLessonMemberLists()
  },
  getLessonMemberLists: function () {
    let that = this
    http.lessonMemberLists({
      data: {},
      success: res => {
        that.setData({
          lessonMemberLists: res.data.list
        })
        that.data.lessonMemberLists.forEach(function(ele, index) {
          if (ele.isdefault == 1) {
              that.setData({
                "payInfo.member_id": ele.member_id
              })
          } else {

          }
      })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  addPersonMsg: function () {
    wx.navigateTo({
      url: '/pages/addPersonMsg/addPersonMsg?type=add',
    })
  },
  updatePersonMsg: function () {
    wx.navigateTo({
      url: '/pages/personMsgList/personMsgList',
    })
  },
  pay: function () {
    let that = this
    if(!that.data.payInfo.member_id){
      toast: {
        app.wxToast({
          title: '请您先选择或者添加报名人'
        })
      };
      return false;
    }
    wx.showLoading({
      title: "正在调起支付···",
      mask: true
    })
    var json = {
      type: that.data.payInfo.type,
      course_id: that.data.payInfo.course_id,
      member_id: that.data.payInfo.member_id,
      course_date_id: that.data.payInfo.course_date_id
    }
    if (that.data.order_id) {
      json.order_id = that.data.order_id
    }
    if (that.data.is_second) {
      json.is_second = that.data.is_second
    }
    console.log(that.data.order_id)
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
    // wx.navigateTo({
    //   url: '/pages/selectedLessonDate/selectedLessonDate?course_id=' + that.data.payInfo.course_id + '&order_id=' + data.order_id + '&address=' + that.data.address + '&from=applyLesson',
    // })
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
          order_id: data.order_num
        })
        console.log(that.data.order_num)
      }
    })
  }
})