// pages/applyHelp/applyHelp.js
import http from '../../utils/api';
const app = getApp();
Page({

  data: {
    type: 1,
    tabArray: [{
      title: '申请',
      type: 1
    }, {
      title: '补助明细',
      type: 2
    }],
    scrollLeft: 'translateX(0%)',
    userInfo: {},
    array: ['线下沙龙会议花费', '线下推广会议花费', '线下交流会议花费', '品牌地推花费'],
    img_arr: [],
    formdata: '',
    upLoadUrl:[],
    index: '',
    status: 'all',
    tabArraySub: [{
      title: '全部',
      status: 'all'
    }, {
      title: '申请中',
      status: 10
    }, {
      title: '已通过',
      status: 20
    }, {
      title: '已驳回',
      status: 40
    }],
    subsidyLog: [],
    page: 1
  },
  onLoad: function (options) {
    let that = this
    that.getUserInfo()
    that.getsubsidyLog()
  },
  go_update() {
    let that = this
    console.log('我更新啦')
    that.setData({
      index: '',
      upLoadUrl: [],
      img_arr: []
    })
  },
  tabS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      type: item.type,
      scrollLeft: 'translateX(' + index * 100 + '%)'
    })
  },
  tabSubS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      status: item.status
    })
  },
  getsubsidyLog: function () {
    let that = this
    http.subsidyLog({
      data: {
        status: that.data.status,
        page: that.data.page
      },
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          subsidyLog: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  tabSubS: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    that.setData({
      status: item.status
    })
    that.getsubsidyLog()
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  getUserInfo: function () {
    let that = this
    http.userInfo({
      data: {},
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          userInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  upimg: function () {
    var that = this;
    if (that.data.img_arr.length < 3) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
          console.log(res.tempFilePaths[0])
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          wx.uploadFile({
            url: 'https://hdt.hdtapp.com/api/common/qiNiuUpload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },
            formData: {
              method: 'POST'   //请求方式
            },
            success(res) {
              var data = JSON.parse(res.data)  // 与wx.request不同的是，upload返回的是字符串格式，需要字符串对象化
              wx.hideToast()
              var upLoadUrl = that.data.upLoadUrl.concat(data.data.url)
              that.setData({
                upLoadUrl: upLoadUrl
              })
              console.log(that.data.upLoadUrl)
            },
            fail(err) {
              console.log(err)
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  submit: function () {
    let that = this
    console.log(that.data.array[that.data.index])
    if (!that.data.array[that.data.index]) {
      toast: {
        app.wxToast({
          title: '请选择申请原因'
        })
      };
      return false;
    }
    if (that.data.upLoadUrl.length == 0) {
      toast: {
        app.wxToast({
          title: '请上传凭证'
        })
      };
      return false;
    }
    wx.navigateTo({
      url: '/pages/applyHelpSubmit/applyHelpSubmit?remark=' + that.data.array[that.data.index] + '&images=' + that.data.upLoadUrl,
    })
  }
})