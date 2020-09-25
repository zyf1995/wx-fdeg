function toLoginCheck() {
  if (!wx.getStorageSync('hdt_userInfo') || wx.getStorageSync('hdt_userInfo').token == ''){
    wx.navigateTo({
      url: '/pages/login/login',
    });
    return false;
  }else{
    return true;
  }
}
function mobileVerify(mobile) {
  var mobileTest = /^1\d{10}$/
  return mobileTest.test(mobile)
}
function add0(m){return m<10?'0'+m:m }
function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth()+1;//获取当前月份的日期
  var d = dd.getDate();
  return add0(m)+"-"+add0(d);
}

function formatRichText(html){
  let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
      match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
      match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
      return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, '');
  newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
  return newContent;
}

module.exports = {
  toLoginCheck: toLoginCheck,
  mobileVerify: mobileVerify,
  GetDateStr: GetDateStr,
  formatRichText: formatRichText
}