// pages/orderRefundSubmit/orderRefundSubmit.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    goodInfo: {},
    stateTran: true,
    reasonTran: true,
    stateType: '2',
    reasonType: '',
    stateText: '',
    reasonText: '',
    img_arr: [],
    remark: '',
    type: '',
    animationData: {},
    upLoadUrl: []
  },
  onLoad: function (options) {
    let that = this
    console.log(options)
    that.setData({
      type: options.type,
      goodInfo: JSON.parse(decodeURIComponent(options.goodInfo))
    })
    console.log(that.data.goodInfo)
  },
  changeVal: function (e) {
    let that = this
    that.setData({
      remark: e.detail.value
    })
  },
  reasonSureFn: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let text = e.currentTarget.dataset.text
    that.setData({
      reasonType: type,
      reasonText: text
    })
    that.reasonTran()
  },
  stateSureFn: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let text = e.currentTarget.dataset.text
    that.setData({
      stateType: type,
      stateText: text
    })
    that.reasonTran()
  },
  reasonTranFn: function (e) {
    var that = this
    that.setData({
      reasonTran: false
    })
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 400)
  },
  // 隐藏遮罩层
  reasonTran: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        reasonTran: true,
        stateTran: true
      })
    }, 400)//先执行下滑动画，再隐藏模块

  },
  stateTranFn: function (e) {
    var that = this
    that.setData({
      stateTran: false
    })
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 400)
  },
  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  upimg: function () {
    var that = this;
    if (that.data.img_arr.length < 3) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        count: 1,
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
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
  clImg: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.data.img_arr.splice(index, 1);
    that.data.upLoadUrl.splice(index, 1);
    that.setData({
      img_arr: that.data.img_arr,
      upLoadUrl: that.data.upLoadUrl
    })
  },
  submit: function () {
    var that = this;
    var json = {};
    var ttype;
    that.data.type ? ttype = 'all' : ttype = 'only';
    http.returnApply({
      data: {
        id: that.data.goodInfo.id,
        type: ttype,
        images: that.data.upLoadUrl,
        remark: that.data.remark,
        express_status: that.data.stateType,
        cause: that.data.reasonType
      },
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if (res.code == 1) {
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 3];
          beforePage.setData({
            txt: '修改数据了'
          })
          beforePage.go_update();
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        }
      },
      fail: err => {
        console.log(err)
      }
    })

  }
})