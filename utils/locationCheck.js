function toLocationCheck (){
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        wx.setStorage({
          key: 'toLocationCheck',
          data: false,
        })
        console.log(11)
      } else {
        wx.setStorage({
          key: 'toLocationCheck',
          data: true,
        })
        console.log(22)
      }   
    }
  })
}
module.exports = {
  toLocationCheck: toLocationCheck
}