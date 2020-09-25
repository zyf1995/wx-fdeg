let ksort = require('./ksort');
import md5 from './md5.js';
module.exports = {
  http(url, method, params) {
    var udata = {};
    var tdata = {};
    udata = ksort.ksort(params.data)
    params.data.timestamp = parseInt((new Date()).getTime() / 1000)
    var str = '';
    var tstr = '';
    tdata = ksort.ksort(params.data)
    Object.keys(tdata).forEach(function (key) {
      if (!(tdata[key] instanceof Array) && !(tdata[key] instanceof Object)) {
        str += key + '=' + tdata[key] + '&';
      }
    });
    str = 'mcode_wts&' + str + 'mcode_wts';
    str.trim()
    var tstr = md5(str);
    tstr = tstr.toUpperCase();
    // let data = {}
    // if (params.data) { 
    //   for (let key in params.data) { 
    //     if (params.data[key] == null || params.data[key] == 'null') {
    //       delete params.data[key]
    //     }
    //   }
    //   data = { ...data, ...params.data }
    // }
    let userInfo = wx.getStorageSync('hdt_userInfo');
    let headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'sign': tstr,
      'timestamp': params.data.timestamp
    }
    if (userInfo && userInfo.token){
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'sign': tstr,
        'timestamp': params.data.timestamp,
        'token': userInfo.token
      }
    }
    let baseUrl = 'https://fd.weitaosong.com/';
    // let baseUrl = 'https://testhdt.teadrf.cn/';
    wx.request({
      url: baseUrl + url, // 就是拼接上前缀,此接口域名是开放接口，可访问
      method: method == 'post' ? 'post' : 'get', // 判断请求类型，除了值等于'post'外，其余值均视作get 其他的请求类型也可以自己加上的
      data: udata,
      header: headers,
      success(res) {
        if (res.data.code == 401){
          wx.showToast({ title: '账号已过期,请重新登录', icon: 'none' });
          setTimeout(function(){
            wx.removeStorageSync('hdt_userInfo')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          },200)
        }else {
          params.success && params.success(res.data)
        }
      },
      fail(err) {
        if(err.data.code == 401){
          wx.showToast({ title: '账号已过期,请重新登录', icon: 'none' });
          wx.removeStorageSync('hdt_userInfo')
          wx.switchTab({
            url: '/pages/home/home',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }else{
          params.fail && params.fail(err)
        }
      }
    })
  }
}
