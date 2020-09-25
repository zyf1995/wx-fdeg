// pages/fightingOrder/fightingOrder.js
import http from '../../utils/api';
let loginCheck = require('../../utils/loginCheck');
const app = getApp();
Page({
  data: {
    rule:'<p>1.拼单1人中奖免单，其余人有红包奖励</p><p>2.拼单1人中奖免单，其余人有红包奖励</p><p>3.拼单1人中奖免单，其余人有红包奖励</p>',
    imageUrl: '',
    showModel: false,
    showModel1: false,
    showModel2: false,
    pageFrom: '',
    goods_id: '',
    goodsInfo: {},
    team_id: '',
    teamDetail: {},
    emptyArr: [],
    good_spec_id: '',
    allOrders: [],
    team_status: '',
    winnerInfo: {},
    userInfo: {},
    payInfo: {
      type: 'money',
      remark: '',
      password: ''
    },
    joinListH: 0,
    isMore: true,
    isShowConfirm: false,
    timer: null
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
        goods_id: getQueryString['id'].split('-')[0],
        pageFrom: 'orderDetail',
        good_spec_id: getQueryString['id'].split('-')[2],
        team_id: getQueryString['id'].split('-')[1],
      })
      wx.setStorage({
        key: 'pid',
        data: getQueryString['pid']
      })
    }else{
      that.setData({
        pageFrom: options.pageFrom || 'orderDetail',
        good_spec_id: options.good_spec_id,
        goods_id: options.goods_id || 274,
        team_id: options.team_id || 1
      })
      wx.setStorage({
        key: 'pid',
        data: options.pid || ''
      })
    }
    // wx.connectSocket({
    //   url: 'wss://testhdt.teadrf.cn:9501',
    //   success(){
    //     console.log("成功")
    //   },
    //   fail(){
    //       console.log("失败")
    //   },
    //   complete(){
    //       console.log("完成");
    //   }
    // })
    // wx.onSocketOpen(function (res) {
    //   console.log('WebSocket连接已打开！')
    // })
    // wx.onSocketMessage(function (res) {
    //   console.log(res)
    //   that.getTeamDetail()
    // })
    // wx.onSocketClose(function (res) {
    //   console.log('WebSocket连接已关闭！')
    // })
    that.getGoodDetail()
    that.getTeamDetail()
    that.getNotice()
    if(!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
      
    }else{
      that.getUserInfo()
    }
  },
  // onUnload: function(){
  //   wx.onSocketOpen(function() {
  //     wx.closeSocket()
  //   })
  // },
  getUserInfo: function (options) {
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
  getNotice(){
    let that = this
    http.getNotice({
      data: {},
      success: res => {
        that.setData({
          rule: res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.userInfo.nickname + '邀请您参加拼赚  ' + this.data.goodsInfo.goods.goods_name, //转发页面的标题
      path: '/pages/fightingOrder/fightingOrder?goods_id=' + this.data.goods_id + '&pid=' + this.data.userInfo.id + '&team_id=' + this.data.team_id + '&good_spec_id=' + this.data.good_spec_id,
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
  allOrderPerson(){
    let that = this
    that.setData({
      showModel: true
    })
  },
  preventTouchMove(){
    let that = this
    that.setData({
      showModel: false,
      showModel1: false,
      showModel2: false
    })
  },
  previewImg: function () {
    let that = this
    let listarray = that.data.goodsInfo.goods.images
    wx.previewImage({
      current: listarray[0],
      urls: listarray,
    })
  },
  getGoodDetail(){
    let that = this
    http.getgoodsdetail({
      data: {
        good_id: that.data.goods_id
      },
      success: res => {
        let content = loginCheck.formatRichText(res.data.goods.content)
        that.setData({
          goodsInfo: res.data,
          "goodsInfo.goods.content": content,
          imageUrl: res.data.goods.images[0]
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  seeMore(){
    let that = this
    that.setData({
      joinListH: 9999,
      isMore: false
    })
  },
  onPullDownRefresh() {
    let that = this
    that.getTeamDetail()
    wx.stopPullDownRefresh()
  },
  getTeamDetail(){
    let that = this
    http.getTeamDetail({
      data: {
        id: that.data.team_id
      },
      success: res => {
        let arrLength = res.data[0].orders.length < 5 ? res.data[0].orders.length:5
        let maxArrLength = res.data[0].user_num_max < 5 ? res.data[0].user_num_max:5
        let emptyArr = [...new Array(maxArrLength - arrLength).keys()]
        that.setData({
          teamDetail: res.data[0],
          emptyArr: emptyArr,
          "teamDetail.orders": res.data[0].orders.slice(0,5),
          allOrders: res.data[0].orders
        })
        let query = wx.createSelectorQuery()
        query.selectAll('.joinPersonInfo').boundingClientRect(function(rect){
          if(rect.length != 0){
            that.setData({
              joinListH: rect[0].height * 6
            })
          }
        }).exec()
        that.data.teamDetail.endtime = that.data.teamDetail.endtime * 1000
        that.data.teamDetail.desiduetime = ''
        that.data.allOrders.forEach(function(tem){
          if(tem.lottery_draw_status == 20){
            that.setData({
              winnerInfo: tem
            })
          }
        })
        that.countDown()
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onUnload() {
    clearInterval(this.data.timer)
  },
  countDown(){
    let that = this
    clearInterval(that.data.timer)
    let timer = setInterval(()=>{
      let nowTime = new Date().getTime()
      if(nowTime <= that.data.teamDetail.endtime){
        let endTime = that.data.teamDetail.endtime - nowTime
        endTime -= 1000
        let t = endTime
        if(t > 0){
            let day = Math.floor(t / 86400000)
            let hour = Math.floor((t / 3600000) % 24)
            let min = Math.floor((t / 60000) % 60)
            let sec = Math.floor((t / 1000) % 60)
            hour = hour < 10 ? '0' + hour : hour
            min = min < 10 ? '0' + min : min
            sec = sec < 10 ? '0' + sec : sec
            let format = ''
            if(day <= 0){
              format = `<span class="color_ff3">${hour}:${min}:${sec}</span>`
            }else{
              format = `<span class="color_ff3">${day}天 ${hour}:${min}:${sec}</span>`
            }
            that.setData({
              "teamDetail.desiduetime": format
            })
        }else{
          let flag = that.teamList.every(function (val, ind) {
            return t <= 0;
          });
          if (flag) clearInterval(timer)
          let format = ''
          format = `<div>剩余 00:00:00</div>`
          that.setData({
            "teamDetail.desiduetime": format
          })
        }
      }else{
        clearInterval(timer)
        let format = ''
        format = `<div>已结束</div>`
        that.setData({
          "teamDetail.desiduetime": format
        })
      }
    },1000)
    that.setData({
      timer: timer
    })
  },
  payTypeS(e) {
    let that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      "payInfo.type": type
    })
  },
  updateValue: function (e) {
    let that = this;
    that.setData({
      "payInfo.password": e.detail.value
    })
  },
  joinTeam(){
    let that = this
    if(!loginCheck.toLoginCheck()){
      return false
    }
    that.setData({
      showModel1: true,
      "payInfo.password": ""
    })
  },
  submit(){
    let that = this
    that.setData({
      showModel1: false
    })
    if (that.data.payInfo.type == 'money' || that.data.payInfo.type == 'bwjd') {
      that.setData({
        isShowConfirm: true
      })
    }else if(that.data.payInfo.type == 'miniapp'){
      wx.showLoading({
        title: "正在调起支付···",
        mask: true
      })
      that.pay()
    }
  },
  pay(){
    let that = this
    let json = {
      team_id: that.data.team_id,
      good_spec_id: that.data.good_spec_id,
      type: that.data.payInfo.type,
      good_id: that.data.goods_id
    }
    if (that.data.payInfo.type == 'money' || that.data.payInfo.type == 'bwjd') {
      json.password = that.data.payInfo.password
    }
    http.joinTeam({
      data: json,
      success: res => {
        if(that.data.payInfo.type == 'miniapp'){
          wx.hideLoading()
        }
        if(res.code == 1){
          if(that.data.payInfo.type == 'miniapp'){
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: function (res) {
                toast: {
                  app.wxToast({
                    title: '支付成功'
                  })
                };
                that.setData({
                  isShowConfirm: false,
                })
                that.getTeamDetail()
              },
              fail: function (err) {
                toast: {
                  app.wxToast({
                    title: '支付失败'
                  })
                };
              }
            })
          }else if(that.data.payInfo.type == 'money' || that.data.payInfo.type == 'bwjd'){
            toast: {
              app.wxToast({
                title: '支付成功'
              })
            };
            that.setData({
              isShowConfirm: false,
            })
            // wx.sendSocketMessage({
            //   data: 'Hello,World:' + Math.round(Math.random() * 0xFFFFFF).toString(),
            // })
            that.getTeamDetail()
          }
        }else{
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
  cancelPay: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  confirmAcceptance:function(){
    var that = this
    if (!that.data.payInfo.password) {
      toast: {
        app.wxToast({
          title: '请输入支付密码'
        })
      };
      return false;
    }
    that.pay()
  },
  go_update(){
    let that = this
    that.getTeamDetail()
  },
  receive(){
    let that = this
    let order_id = ''
    that.data.allOrders.forEach(function(tem){
      if(that.data.userInfo.id == tem.user.id){
        order_id = tem.id
      }
    })
    wx.navigateTo({
      url: '/pages/receiveProduct/receiveProduct?goods_id=' + that.data.goods_id + '&order_id=' + order_id,
    })
  },
  convert(){
    let that = this
    let order_id = ''
    that.data.allOrders.forEach(function(tem){
      if(that.data.userInfo.id == tem.user.id){
        order_id = tem.id
      }
    })
    wx.showModal({
      title: '提示',
      content: '您确定要兑换百旺金豆吗？',
      success (res) {
        if (res.confirm) {
          http.forVouchers({
            data: {
              order_id: order_id
            },
            success: res => {
              toast: {
                app.wxToast({
                  title: res.msg
                })
              };
              that.getTeamDetail()
            },
            fail: err => {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  shareFriend(){
    let that = this
    if (!loginCheck.toLoginCheck()) {
      return false
    } else {
      that.setData({
        showModel2: true
      })
      that.getHomeShare()
      wx.showLoading({								//显示 loading 提示框
        title: "正在生成海报···",
      })
    }
  },
  getHomeShare: function () {
    let that = this
    http.team_share({
      data: {
        goods_id: that.data.goods_id,
        good_spec_id: that.data.good_spec_id,
        team_id: that.data.team_id
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