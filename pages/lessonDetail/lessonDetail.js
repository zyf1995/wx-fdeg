// packageB/pages/lessonDetail/lessonDetail.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
let wxparse = require("../../wxParse/wxParse.js");
const app = getApp();
Page({
  data: {
    cdnUrl: app.globalData.cdnUrl,
    course_id: '',
    lesson_detail: {},
    userInfo: {},
    navState: 0,
    showDialog: false,
    poster: ''
  },
  onLoad: function (options) {
    let that = this
    if (options.scene) {
      let getQueryString = {}
      let strs = decodeURIComponent(options.scene).split('&')
      for (var i = 0; i < strs.length; i++) {
        getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
      that.setData({
        course_id: getQueryString['course_id']
      })
      wx.setStorage({
        key: 'pid',
        data: getQueryString['pid']
      })
    } else {
      that.setData({
        course_id: options.course_id
      })
      wx.setStorage({
        key: 'pid',
        data: options.pid || ''
      })
    }
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
    that.getLessonDetail()
  },
  onShareAppMessage: function () {
    return {
      title: this.data.lesson_detail.course.name, //转发页面的标题
      path: '/pages/lessonDetail/lessonDetail?course_id=' + this.data.course_id + '&pid=' + this.data.userInfo.id,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
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
  navigation(e){
    let that = this
    wx.openLocation({
      latitude: parseFloat(that.data.lesson_detail.course.lat),
      longitude: parseFloat(that.data.lesson_detail.course.lng),
      name: that.data.lesson_detail.course.name,
      scale: 10,
      address: that.data.lesson_detail.course.address,
      success:function(r){
        console.log(r)
      },
      fail:function(err){
        console.log(err)
      }
    })  
  },
  getLessonDetail: function () {
    let that = this
    http.lessonDetail({
      data: {
        course_id: that.data.course_id
      },
      success: res => {
        that.setData({
          lesson_detail: res.data
        })
        wxparse.wxParse('contentInfo', 'html', res.data.course.content, this, 0);
        wxparse.wxParse('remarkInfo', 'html', res.data.course.remark, this, 0);
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  //监听滑块
  bindchange(e) {
    let index = e.detail.current;
    this.setData({
      navState: index
    })
  },
  //点击导航
  navSwitch: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      navState: index
    })
  },
  apply: function () {
    let that = this
    if (!loginCheck.toLoginCheck()) {
      return false
    }else{
      var firstPrice = that.data.lesson_detail.course.first_price
      var secondPrice = that.data.lesson_detail.course.second_price
      wx.navigateTo({
        url: '/pages/applyLesson/applyLesson?course_id=' + that.data.lesson_detail.course.id + '&address=' + that.data.lesson_detail.course.address + '&first_price=' + firstPrice + '&second_price=' + secondPrice+ '&is_first=' + that.data.lesson_detail.course.is_first,
      })
    }
  },
  goLessonDate: function () {
    let that = this
    wx.navigateTo({
      url: '/pages/selectedLessonDate/selectedLessonDate?course_id=' + that.data.lesson_detail.course.id + '&address=' + that.data.lesson_detail.course.address + '&from=lessonDetail',
    })
  },
  shareApp: function () {
    let that = this
    if (!loginCheck.toLoginCheck()) {
      return false
    }else{
      that.setData({
        showModel: true
      })
      that.getHomeShare()
      wx.showLoading({								//显示 loading 提示框
        title: "正在生成海报···",
      })
    }
  },
  getHomeShare: function () {
    let that = this
    http.lessonShare({
      data: {
        course_id: that.data.course_id,
        pid: that.data.userInfo.id
      },
      success: res => {
        wx.hideLoading()
        that.setData({
          poster: res.data.url
        })
        console.log(that.data.poster)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  preventTouchMove: function () {
    this.setData({
      showModel: false
    })
  },
  share: function () {
    wx.showLoading({
      title: "正在下载···",
    })
    this.wxToPromise('downloadFile', {
      url: this.data.poster
    })
      .then(res => this.wxToPromise('saveImageToPhotosAlbum', {
        filePath: res.tempFilePath
      }))
      .then(res => {
        console.log(res);
        wx.hideLoading()
        wx.showToast({
          title: '保存成功~',
          icon: 'success',
        });
      })
      .catch(({ errMsg }) => {
        console.log(errMsg)
        wx.hideLoading()
        // if (~errMsg.indexOf('cancel')) return;
        if (!~errMsg.indexOf('auth')) {
          wx.showToast({ title: '图片保存失败，稍后再试', icon: 'none' });
        } else {
          // 调用授权提示弹框
          this.setData({
            showDialog: true
          })
        };
      })
  },
  wxToPromise(method, opt) {
    return new Promise((resolve, reject) => {
      wx[method]({
        ...opt,
        success(res) {
          opt.success && opt.success();
          resolve(res)
        },
        fail(err) {
          opt.fail && opt.fail();
          reject(err)
        }
      })
    });
  },
  confirm() {
    this.setData({
      showDialog: false
    })
  },
  cancel() {
    this.setData({
      showDialog: false
    })
  },
})