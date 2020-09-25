// pages/orderRefund/orderRefund.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    type: '',
    goodInfo: {},
    expressList: [],
    express_no: '',
    express: '',
    returnInfo: {
      express_no: '1'
    },
    expressType: false,
    array: ['线下沙龙会议花费', '线下推广会议花费', '线下交流会议花费', '品牌地推花费'],
    index: ''
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      type: options.type,
      goodInfo: JSON.parse(decodeURIComponent(options.goodInfo))
    })
    console.log(that.data.goodInfo)
    if (that.data.type == 2) {
      http.expressList({
        data: {},
        success: res => {
          that.setData({
            array: res.data.rows
          })
        },
        fail: err => {
          console.log(err)
        }
      })
      http.returnApply1({
        data: {
          id: that.data.goodInfo.id
        },
        success: res => {
          that.setData({
            returnInfo: res.data
          })
          if (that.data.returnInfo.status == 20) {
            toast: {
              app.wxToast({
                title: '该订单已退货完成'
              })
            };
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
          if (that.data.returnInfo.status == 30) {
            for (let i of that.data.expressList) {
              if (i.id == that.data.returnInfo.express_company) {
                that.data.returnInfo.express_company = i.company
                break;
              }
            }
          }
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      express: this.data.array[e.detail.value].id
    })
  },
  updateValue: function (e) {
    let that = this
    that.setData({
      express_no: e.detail.value
    })
  },
  orderRefundSubmit: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/orderRefundSubmit/orderRefundSubmit?goodInfo=' + encodeURIComponent(JSON.stringify(that.data.goodInfo)) + '&type=' + type,
    })
  },
  submit: function () {
    let that = this
    if (!that.data.express) {
      toast: {
        app.wxToast({
          title: '请选择快递公司'
        })
      };
      return
    }
    if (!that.data.express_no) {
      toast: {
        app.wxToast({
          title: '请填写快递单号'
        })
      };
      return
    }
    http.returnPost({
      data: {
        id: that.data.returnInfo.id,
        express_no: that.data.express_no,
        express_company: that.data.express
      },
      success: res => {
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        if (res.code == 1) {
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
  cancelReturn: function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '您确定要撤销当前退款申请吗？',
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.cancel) {
          console.log("点击了取消按钮")
        } else {
          console.log("点击了确定按钮")
          http.cancelReturn({
            data: {
              id: that.data.returnInfo.id
            },
            success: res => {
              if (res.code == 1) {
                toast: {
                  app.wxToast({
                    title: '撤销成功'
                  })
                };
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
        }
      }
    })
  }
})