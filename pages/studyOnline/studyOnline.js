// pages/studyOnline/studyOnline.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
function get_wxml(className, callback) {
  wx.createSelectorQuery().selectAll(className).boundingClientRect(callback).exec()
}
Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  data: {
    id:'',
    vc_detail:{},
    playUrl:"",
    videoNum:'',
    navState: 0,
    videoId:'',
    swiperH:'',
    isHidden: true
  },

  onLoad: function (options) {
    let that = this
    that.setData({
      id: options.id
    })
    that.getDetail()
  },
  go_update(){
    let that = this
    console.log("数据更新")
    that.getDetail()
    that.videoContext.play()
    that.setData({
      isHidden: true
    })
  },
  getDetail: function () {
    let that = this
    http.vcDetail({ // 调用接口，传入参数
      data: {
        course_id: that.data.id
      },
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          vc_detail: res.data,
          videoNum: res.data.videos.length,
          playUrl: res.data.videos[0].link || 'http://cdn.hdtapp.com' + res.data.videos[0].video_file,
          videoId: res.data.videos[0].id
        })
        that.getHeight()
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getHeight: function () {
    let that = this
    let id = that.data.vc_detail.id
    get_wxml(`.li${id}`, (rects) => {
      let sum_heigth = 0
      for (let i = 0; i < that.data.videoNum; i++) {
        sum_heigth += rects[i].height
      }
      that.setData({
        swiperH: sum_heigth
      })
      console.log(that.data.swiperH)
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
  playVideoAgain: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    that.setData({
      videoId: item.id,
    })
    if (that.data.vc_detail.purchase_info.is_buy == 1){
      this.videoContext.play()
      that.setData({
        isHidden: true,
        playUrl: item.link || 'http://cdn.hdtapp.com' + item.video_file
      })
    }else{
      if(item.is_try == 10){
        //
        this.videoContext.play()
        that.setData({
          isHidden: true,
          playUrl: item.link || 'http://cdn.hdtapp.com' + item.video_file
        })
      }else{
        console.log("未购买")
        that.setData({
          isHidden: false
        })
        this.videoContext.pause()
      }
    }
    console.log(that.data.playUrl)
  },
  goBuy: function () {
    let that = this
    wx.navigateTo({
      url: '/pages/studyBuy/studyBuy?id=' + that.data.id,
    })
  }
})