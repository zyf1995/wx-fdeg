// pages/my/my.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    to_be:'',
    userInviter: {},
    orderNum: '',
    serveVersion:{},
    downLoadUrl:"",
    hidden: true,
    showDialog: false,
    showModel: false,
    poster: "",
    showModal1: false,
    step: 1,
    code: '',
    inviterInfo: {},
    isObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.scene) {
      let getQueryString = {}
      let strs = decodeURIComponent(options.scene).split('&')
      for (var i = 0; i < strs.length; i++) {
        getQueryString[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
      wx.setStorage({
        key: 'pid',
        data: getQueryString['pid']
      })
    } else {
      wx.setStorage({
        key: 'pid',
        data: options.pid || ''
      })
    }
    // that.getServeVersion();
    that.setData({
      isObj: JSON.stringify({})
    })
  },
  onShow: function () {
    let that = this;
    that.getUserInfo();
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo2();
      that.getOrderNum();
    }
  },
  changeVal: function (e) {
    let that = this
    that.setData({
      code: e.detail.value
    })
  },
  getInviterToast: function (e) {
    let that = this
    that.setData({
      showModal1: true,
      step: 1,
      isObj: JSON.stringify({}),
      inviterInfo: {},
      code: ''
    })
  },
  goAuthentication: function () {
    let that = this
    that.setData({
      step: 2
    })
  },
  goBack: function () {
    let that = this
    that.setData({
      step: 1
    })
  },
  query: function () {
    var that = this
    var json = {
      mobile: that.code
    }
    http.checkRecommender({
      data: {
        mobile: that.data.code
      },
      success: res => {
        if (res.code == 1) {
          that.setData({
            inviterInfo: res.data,
            isObj: JSON.stringify(res.data)
          })
        } else {
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
  submit: function () {
    let that = this
    http.bindPid({
      data: {
        pid: that.data.inviterInfo.id
      },
      success: res => {
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        that.setData({
          showModal1: false
        })
        that.getUserInviter();
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  close: function () {
    let that = this
    that.setData({
      showModal1: false
    })
  },
  closeTip: function () {
    let that = this
    that.setData({
      hidden: false
    })
  },
  onPullDownRefresh() {
    let that = this
    that.getUserInfo();
    that.getUserInfo2();
    // that.getUserInviter();
    that.getOrderNum();
    wx.stopPullDownRefresh()
  },
  goOrderList: function (e) {
    let that = this
    let dataType = e.currentTarget.dataset.datatype
    wx.navigateTo({
      url: '/pages/orderList/orderList?dataType=' + dataType,
    })
  },
  goShopCenter: function () {
    wx.navigateTo({
      url: '/pages/shopCenter/shopCenter',
    })
  },
  getUserInviter: function () {
    let that = this
    http.userInviter({
      data: {},
      success: res => {
        // console.log('接口请求成功', res)
        that.setData({
          userInviter: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getOrderNum: function (options) {
    let that = this
    http.mallOrderNum({
      data: {},
      success: res => {
        // console.log('接口请求成功', res)
        that.setData({
          orderNum: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getUserInfo: function () {
    let that = this
    http.userInfo({
      data:{},
      success: res => {
        // that.getUserInviter();
        that.setData({
          userInfo: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getUserInfo2: function (options) {
    let that = this
    http.userInfo2({
      data: {},
      success: res => {
        // console.log('接口请求成功', res)
        that.setData({
          to_be: res.data.to_be
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  getServeVersion: function (options) {
    let that = this
    http.appVersion({
      data: {},
      success: res => {
        //console.log('接口请求成功', res)
        that.setData({
          serveVersion: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  copy: function (e) {
    let that = this;
    let phone = e.currentTarget.dataset.mobile
    wx.setClipboardData({
      data: phone,
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
  goWithdraw: function () {
    wx.navigateTo({
      url: '/pages/withdraw/withdraw',
    })
  },
  downLoadApp: function () {
    let that = this;
    let appVersion = wx.getSystemInfoSync().platform;
    if (appVersion == 'android'){
      that.setData({
        downLoadUrl: that.data.serveVersion.app_downloaduri
      })
    }else{
      that.setData({
        downLoadUrl: that.data.serveVersion.app_downloaduri_ios
      })
    }
    wx.showModal({
      title: '下载APP',
      content: '请复制链接后，在浏览器粘贴后打开',
      confirmText: "复制链接",
      success : function (res) {
        if (res.cancel) {
          console.log("点击了取消按钮")
        } else {
          //点击确定
          console.log("点击了确定按钮")
          wx.setClipboardData({
            data: that.data.downLoadUrl,
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
        }
      }
    })
  },
  goAddressList: function () {
    wx.navigateTo({
      url: '/pages/addressList/addressList',
    })
  },
  onShareAppMessage: function () {
    return {
      title: (this.data.userInfo.nickname || this.data.userInfo.mobile) + '邀请你加入丰德E购！',
      path: 'pages/my/my?pid=' + this.data.userInfo.id,
      imageUrl: 'http://fd.weitaosong.com/wechatqr/fdegShare_icon.png',
      success: (res) => {
        // 分享成功
      },
      fail: (res) => {
        // 分享失败
      }
    }
  },
  goShopProfit: function (e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/shopProfitDetail/shopProfitDetail?type=' + type,
    })
  },
  goBranchRecord(){
    wx.navigateTo({
      url: '/pages/branchRecord/branchRecord',
    })
  },
  goShopArrive: function () {
    wx.navigateTo({
      url: '/pages/shopArrive/shopArrive',
    })
  },
  goShopTeamOrder: function () {
    wx.navigateTo({
      url: '/pages/shopTeamOrder/shopTeamOrder',
    })
  },
  goTeamList: function () {
    wx.navigateTo({
      url: '/pages/teamList/teamList',
    })
  },
  goApplyHelp: function () {
    wx.navigateTo({
      url: '/pages/applyHelp/applyHelp',
    })
  },
  shareApp: function () {
    let that = this
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      wx.navigateTo({
        url: '/pages/shareApp/shareApp',
      })
    }
  },
  getHomeShare: function () {
    let that = this
    http.homeShare({
      data: {},
      success: res => {
        wx.hideLoading()
        that.setData({
          poster: res.data[0]
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
  goLessonList: function (){
    wx.navigateTo({
      url: '/packageB/pages/lessonList/lessonList',
    })
  },
  goFightOrderList(e){
    let dataType = e.currentTarget.dataset.datatype
    wx.navigateTo({
      url: '/pages/fightingOrderList/fightingOrderList?dataType=' + dataType,
    })
  },
  goGroupShop(){
    wx.navigateTo({
      url: '/pages/groupShopList/groupShopList',
    })
  },
  goGroupOrderList(e){
    let dataType = e.currentTarget.dataset.datatype
    wx.navigateTo({
      url: '/pages/groupOrderList/groupOrderList?status=detail&dataType=' + dataType,
    })
  },
  go_update(){
    console.log("百旺金转换")
    this.getUserInfo()
  }
})