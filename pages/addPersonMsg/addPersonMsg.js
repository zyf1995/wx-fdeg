// packageB/pages/addPersonMsg/addPersonMsg.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    type: 'add',
    id: '',
    info:{
      name: '',
      phone: '',
      isdefault: 1
    },
    isdefault: 0,
    isChecked: true
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      type: options.type,
      id: options.id
    })
    if (that.data.type == 'edit') {
      that.getMemberDetail()
    }
  },
  updateValue1: function (e) {
    let that = this
    that.setData({
      "info.name": e.detail.value
    })
  },
  updateValue2: function (e) {
    let that = this
    that.setData({
      "info.phone": e.detail.value
    })
  },
  updateValue3: function (e) {
    let that = this
    that.setData({
      "info.id_no": e.detail.value
    })
  },
  bindDateChange: function(e) {
    console.log(e.detail)
    this.setData({
      "info.birth": e.detail.value
    })
  },
  getMemberDetail: function () {
    let that = this
    http.lessonMemberDetail({
      data: {
        id: that.data.id
      },
      success: res => {
        that.setData({
          "info.name": res.data.detail.name,
          "info.phone": res.data.detail.phone,
          "info.isdefault": res.data.detail.isdefault,
          isdefault: res.data.detail.isdefault
        })
        if (that.data.info.isdefault == 1) {
          that.setData({
            isChecked: true
          })
        }else {
          that.setData({
            isChecked: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  switchChange: function (e) {
    let that = this
    if(e.detail.value){
      that.setData({
        "info.isdefault": 1
      })
    }else{
      that.setData({
        "info.isdefault": 0
      })
    }
    console.log(that.data.info.isdefault)
  },
  deleteS: function (){
    var that = this
    var json = {
      id: that.data.id
    }
    if (that.data.isdefault == 1) {
        toast: {
          app.wxToast({
            title: '无法删除默认项'
          })
        };
        return false
    }else{
      http.delLessonMember({
        data: json,
        success: res => {
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
  },
  update: function () {
    let that = this
    var json = that.data.info
    json.id = that.data.id
    http.editLessonMember({
      data: json,
      success: res => {
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
  },
  add: function () {
    let that = this
    if (!that.data.info.name) {
      toast: {
        app.wxToast({
          title: '请您先填写报名人姓名'
        })
      };
      return false;
    }
    if (!that.data.info.phone) {
      toast: {
        app.wxToast({
          title: '请您先填写报名人手机号'
        })
      };
      return false;
    }
    http.addLessonMember({
      data: that.data.info,
      success: res => {
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