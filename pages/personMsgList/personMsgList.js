// packageB/pages/personMsgList/personMsgList.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    lessonMemberLists:[]
  },
  onLoad: function (options) {
    let that = this
    that.getLessonMemberLists()
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
        
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  edit: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/addPersonMsg/addPersonMsg?type=edit&id=' + item.member_id,
    })
  },
  addPersonMsg: function () {
    let that = this
    wx.navigateTo({
      url: '/pages/addPersonMsg/addPersonMsg?type=add',
    })
  },
  defaultS: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    http.updateLessonMember({
      data: {
        id: id
      },
      success: res => {
        toast: {
          app.wxToast({
            title: "修改成功"
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