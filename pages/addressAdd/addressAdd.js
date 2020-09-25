// pages/addressList/addressList.js
const app = getApp();
import http from '../../utils/api';
Page({

  data: {
    region: ['北京市', '北京市', '东城区'],
    info: {
      name: '',
      phone: '',
      detail: '',
      region: ''
    },
    handle: '',
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.data.handle = options.handle
    that.data.id = options.id
    if (options.handle == 'edit'){
      that.getInfo()
    }else{

    }
  },
  onRise: function () {
    let that = this
    wx.getSetting({
      success(res) {
        console.log("vres.authSetting['scope.address']：", res.authSetting['scope.address'])
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              console.log(res)
              that.setData({
                "info.name": res.userName,
                "info.phone": res.telNumber,
                "info.detail": res.detailInfo,
                "info.region": res.provinceName + ',' + res.cityName + ',' + res.countyName
              })
            }
          })
        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            wx.chooseAddress({
              success(res) {
                that.setData({
                  "info.name": res.userName,
                  "info.phone": res.telNumber,
                  "info.detail": res.detailInfo,
                  "info.region": res.provinceName + ',' + res.cityName + ',' + res.countyName
                })
              }
            })
          }
        }
      }
    })
  },
  getInfo:function () {
    let that = this
    http.addressDetail({ // 调用接口，传入参数
      data: {
        id: that.data.id
      },
      success: res => {
        console.log('接口请求成功', res)
        that.setData({
          "info.name": res.data.detail.name,
          "info.phone": res.data.detail.phone,
          "info.detail": res.data.detail.detail,
          "info.region": res.data.detail.Area.province + ',' + res.data.detail.Area.city + ',' + res.data.detail.Area.region
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    this.setData({
      "info.region": e.detail.value[0] + ',' + e.detail.value[1] + ',' + e.detail.value[2]
    })
    console.log(this.data.info.region)
  },
  updateValue1: function (e) {
    this.setData({
      "info.name": e.detail.value
    })
  },
  updateValue2: function (e) {
    this.setData({
      "info.phone": e.detail.value
    })
  },
  updateValue3: function (e) {
    this.setData({
      "info.detail": e.detail.value
    })
  },
  submit: function () {
    let that = this
    if (!that.data.info.name){
      toast: {
        app.wxToast({
          title: '请填写收货人姓名！'
        })
      };
      return false;
    }
    if (!that.data.info.phone) {
      toast: {
        app.wxToast({
          title: '请填写收货人联系方式！'
        })
      };
      return false;
    }
    if (!that.data.info.region) {
      toast: {
        app.wxToast({
          title: '请选择收货地址！'
        })
      };
      return false;
    }
    if (!that.data.info.detail) {
      toast: {
        app.wxToast({
          title: '请填写详细的收货地址！'
        })
      };
      return false;
    }
    http.addressAdd({
      data:that.data.info,
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if(res.code == 1){
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          beforePage.setData({
            txt: '修改数据了'
          })
          beforePage.go_update();
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  update: function () {
    let that = this
    if (!that.data.info.name) {
      toast: {
        app.wxToast({
          title: '请填写收货人姓名！'
        })
      };
      return false;
    }
    if (!that.data.info.phone) {
      toast: {
        app.wxToast({
          title: '请填写收货人联系方式！'
        })
      };
      return false;
    }
    if (!that.data.info.region) {
      toast: {
        app.wxToast({
          title: '请选择收货地址！'
        })
      };
      return false;
    }
    if (!that.data.info.detail) {
      toast: {
        app.wxToast({
          title: '请填写详细的收货地址！'
        })
      };
      return false;
    }
    http.addressEdit({
      data: that.data.info,
      success: res => {
        console.log('接口请求成功', res)
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if(res.code == 1){
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          beforePage.setData({
            txt: '修改数据了'
          })
          beforePage.go_update();
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})