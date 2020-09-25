// pages/branchRecord/branchRecord.js
import http from '../../utils/api';
const app = getApp();
Page({
  data: {
    currentScore:'',
    list:[],
    ratio: 0,
    noMore:false,
    hasMoreData: false,
    page: 1,
    pageSize: 10,
    noMore: false,
    isShowConfirm: false,
    bwgNum: ''
  },
  onLoad: function (options) {
    let that = this
    that.getList()
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getList()
    } else {
      toast: {
        app.wxToast({
          title: '没有更多数据'
        })
      };
    }
  },
  getList(){
    let that = this
    http.scoreLog({ // 调用接口，传入参数
      data: {
        page:that.data.page
      },
      success: res => {
        that.setData({
          currentScore: res.data.currentScore,
          ratio: res.data.ratio
        })
        if (res.data.list.length > 0) {
          let list1 = that.data.list;
          if (that.data.page == 1) {
            list1 = []
          }
          let list = res.data.list;
          if (list.length < that.data.pageSize) {
            that.setData({
              list: list1.concat(list),
              hasMoreData: false,
              noMore: true
            })
          } else {
            that.setData({
              list: list1.concat(list),
              hasMoreData: true,
              page: that.data.page + 1
            })
          }
        } else {
          that.setData({
            list: res.data.list,
            hasMoreData1: false,
            noMore: true
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  saleOut(){
    var that = this
    that.setData({
      isShowConfirm: true,
      bwgNum: ''
    })
  },
  setValue: function (e) {
    this.setData({
      bwgNum: e.detail.value
    })
  },
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  confirmAcceptance:function(){
    var that = this
    if(!that.data.bwgNum){
      toast: {
        app.wxToast({
          title: '出售数量不能为空'
        })
      };
    }
    http.bawjToMoney({
      data: {
        num: that.data.bwgNum
      },
      success: res => {
        toast: {
          app.wxToast({
            title: res.msg
          })
        };
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        beforePage.setData({
          txt: '修改数据了'
        })
        beforePage.go_update();
        that.setData({
          isShowConfirm: false,
        })
        that.getList()
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})