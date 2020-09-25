// 在这里面定义所有接口，一个文件管理所有接口，易于维护
import { http } from './http'; // 引入刚刚封装好的http模块，import属于ES6的语法，微信开发者工具必须打开ES6转ES5选项
function wechatLogin(params) { //登录
  http('api/user/wechatLogin', 'get', params)
}
function wechatMobileLogin(params) { //手机号登录
  http('api/user/wechatMobileLogin', 'get', params)  
}
function liveBanner(params) {
  http('api/live/live/liveNews', 'post', params)
}
function liveHotSale(params) { 
  http('api/live/live/hotSale', 'post', params) 
}
function onLineList(params) {
  http('api/live/room/onLineList', 'post', params) 
}
function mallOrderList(params) {//获取订单列表
  http('addons/litestore/api.order/my', 'get', params)
}
function mallBuyNow(params) {
  http('addons/litestore/api.order/buyNow', 'get', params)
}
function addressList(params) { //地址列表
  http('addons/litestore/api.adress/lists', 'get', params)
}
function addressDefault(params) { //设置默认地址
  http('addons/litestore/api.adress/setdefault', 'get', params)
}
function addressDelete(params) { //删除地址
  http('addons/litestore/api.adress/del', 'get', params)
}
function addressAdd(params) { //添加地址
  http('addons/litestore/api.adress/add', 'post', params)
}
function searchRoom(params) { //直播间搜索
  http('api/live/room/searchRoom', 'post', params)
}
function addressDetail(params) { //获取地址信息
  http('addons/litestore/api.adress/detail', 'get', params)
}
function addressEdit(params) { //编辑地址
  http('addons/litestore/api.adress/edit', 'get', params)
}
function mallAddCart(params) { //自营商城加入购物车
  http('addons/litestore/api.cart/add', 'get', params)
}
function userInfo(params) { //用户信息
  http('api/user/index', 'post', params)
}
function userInfo2(params) { //用户信息2
  http('api/home/index', 'post', params)
}
function userInviter(params) { //用户信息2
  http('api/user/inviter', 'get', params)
}
function mallOrderNum(params) { //订单数量
  http('api/home/get_order_num', 'get', params)
}
function mallOrderInfo(params) { //获取订单详情
  http('addons/litestore/api.order/detail', 'get', params)
}
function mallOrderReceived(params) { //确认收货
  http('addons/litestore/api.order/finish', 'post', params)
}
function mallOrderCancel(params) { //取消订单
  http('addons/litestore/api.order/cancel', 'get', params)
}
function mallCartList(params) { //自营商城购物车列表
  http('addons/litestore/api.cart/getlists', 'get', params)
}
function goodList(params) { //自营商城购物车列表
  http('api/live/room/goodsList', 'post', params)
}
function mallGoodsInfo(params) { //自营商城商品详情
  http('addons/litestore/api.goods/detail', 'get', params)
}
function mallCartList(params) { //自营商城购物车列表
  http('addons/litestore/api.cart/getlists', 'get', params)
}
function liveBooking(params) { //预约直播
  http('api/live/room/booking', 'post', params)
}
function liveCancelBooking(params) { //取消预约直播
  http('api/live/room/cancelBooking', 'post', params)
}
function mallSubCart(params) { //自营商城购物车减少数量
  http('addons/litestore/api.cart/sub', 'get', params)
}
function mallCartPay(params) { //自营商城购物车订单支付
  http('addons/litestore/api.order/cart', 'post', params)
}
function mallCartDelete2(params) { //自营商城购物车多选删除
  http('addons/litestore/api.cart/multiDelete', 'post', params)
}
function appVersion(params) { //app版本
  http('api/index/app_version', 'get', params)
}
function mallBuyNowPay(params) { //app版本
  http('addons/litestore/api.order/buyNow_pay', 'post', params)
}
function getwechatlive(params) { //获取微信直播列表
  http('api/live/room/getWechatLiveList', 'get', params)
}
function wxLiveShare(params) { //分享二维码海报
  http('api/live/live/share', 'get', params)
}
function goodsShare(params) { //商品分享二维码
  http('api/shops/groupgoods/share', 'post', params)
}
function mallOrderPay(params) { //订单列表支付
  http('addons/litestore/api.order/order_pay', 'get', params)
}
function getWechatLiveInfo(params) { //获取微信直播间信息
  http('api/live/room/getWechatLiveInfo', 'get', params)
}
function dsProductDetail(params) { //门店产品详情（用户）
  http('api/realstore.product/detail', 'get', params)
}
function dsUsercartAdd(params) { //购物车添加商品（用户）
  http('api/realstore.usercart/add', 'post', params)
}
function dsUserPreProductOrder(params) { //提交订单预备（用户产品）
  http('api/realstore.order/userPreProductOrder', 'get', params)
}
function dsAddressDefault(params) { //收货地址默认
  http('api/realstore.address/default', 'get', params)
}
function dsGetIndexMerPic(params) { //获取首页门店轮播图
  http('api/realstore.store/getIndexMerPic', 'get', params)
}
function dsProductType(params) { //产品分类
  http('api/realstore.product/cate', 'get', params)
}
function dsProductList(params) { //产品列表（用户）
  http('api/realstore.product/product', 'get', params)
}
function dsGetAdmin(params) { //获取总店的id
  http('api/realstore.store/getAdmin', 'get', params)
}
function dsOrderPostage(params) { //运费计算
  http('api/realstore.order/postage', 'get', params)
}
function vcSlide(params) { //学习首页banner
  http('api/vc/slide', 'post', params)
}
function vcType(params) { //视频类别
  http('api/vc/type', 'post', params)
}
function vcHot(params) { //热门排行榜
  http('api/vc/hot', 'post', params)
}
function vcDetail(params) { //精选好课
  http('api/vc/courseDetail', 'post', params)
}
function vcHao(params) { //精选好课
  http('api/vc/hao', 'post', params)
}
function vc_course_pay(params) { //课程支付
  http('api/vc/course_pay', 'post', params)
}
function dsOrderUserCommitShop(params) { //提交订单（用户产品）
  http('api/realstore.order/userCommitProductOrder', 'post', params)
}
function dsOrderUserCommitCart(params) { //提交订单（用户购物车）
  http('api/realstore.order/userCommitCartOrder', 'post', params)
}
function dsOrderPay(params) { //支付接口
  http('api/realstore.pay/realstorePay', 'post', params)
}
function dsUsercartList(params) { //购物车列表（用户）
  http('api/realstore.usercart/index', 'get', params)
}
function dsUcUserCartSum(params) { //购物车总价（用户）
  http('api/realstore.usercart/userCartSum', 'get', params)
}
function dsUserPreCartOrder(params) { //提交订单预备（用户购物车）
  http('api/realstore.order/userPreCartOrder', 'get', params)
}
function mallCartBuyNow2(params) { //自营商城购物车订单支付
  http('addons/litestore/api.order/cart_pay', 'post', params)
}
function dsUsercartReduce(params) { //门店购物车单数量删除
  http('api/realstore.usercart/reduce', 'post', params)
}
function dsUcMuldelete(params) { //购物车批量删除（用户）
  http('api/realstore.usercart/muldelete', 'get', params)
}
function shopProfitDetail(params) { //店主收益报表明细
  http('api/vipcenter/earnings_record', 'get', params)
}
function uncollected(params) { //即将到账明细
  http('api/home/uncollected', 'post', params)
}
function shopCenter(params) { //店主中心信息
  http('api/vipcenter/index', 'get', params)
}
function shopMallTeamorder(params) { //店主团队商城和礼包粉丝订单
  http('api/vipcenter/sons_wts_order', 'get', params)
}
function teamAssets(params) { //团队粉丝信息统计
  http('api/vipcenter/team_fans_index', 'get', params)
}
function teamList(params) { //团队粉丝
  http('api/vipcenter/team_fans_list', 'get', params)
}
function commonUpload(params) { //上传图片
  http('api/common/qiNiuUpload', 'post', params)
}
function subsidyLog(params) { //补助明细
  http('api/subsidy/log', 'post', params)
}
function addSubsidy(params) { //申请补助
  http('api/subsidy/add', 'get', params)
}
function addSubsidy1(params) { //申请补助
  http('api/subsidy/add', 'post', params)
}
function bindAlipay(params) { //绑定支付宝/银行卡
  http('api/home/band_account', 'get', params)
}
function bindAlipay1(params) { //绑定支付宝/银行卡
  http('api/home/band_account', 'post', params)
}
function sendSms(params) { //发送验证码
  http('api/sms/send', 'post', params)
}
function mallHome(params) { //自营商城首页
  http('addons/litestore/api.index/index', 'get', params)
}
function userGuide(params) { //新手指引
  http('api/index/article_list', 'get', params)
}
function mallShopInfo(params) { //自营商城首页
  http('addons/litestore/api.goods/shopInfo', 'get', params)
}
function shopPackage(params) { //店主礼包
  http('api/index/package_index', 'get', params)
}
function mallCateGoodsList(params) { //分类商品列表，搜索
  http('addons/litestore/api.goods/category_list', 'get', params)
}
function checkRecommender(params) { //查询会员信息(推荐人)
  http('api/validate/check_recommender', 'get', params)
}
function bindPid(params) { //更改上级
  http('api/user/bindPid', 'post', params)
}
function userWithdraw(params) { //提现
  http('api/home/withdraw', 'get', params)
}
function userWithdraw1(params) { //提现
  http('api/home/withdraw', 'post', params)
}
function returnApply(params) { //退款提交
  http('addons/litestore/api.order/returnApply', 'post', params)
}
function expressList(params) { //快递公司列表
  http('api/shops.shop/expressList', 'get', params)
}
function returnApply1(params) { //退款提交
  http('addons/litestore/api.order/returnApply', 'get', params)
}
function cancelReturn(params) { //撤销退款
  http('addons/litestore/api.order/cancelReturn', 'get', params)
}
function returnPost(params) { //快递单号
  http('addons/litestore/api.order/returnPost', 'post', params)
}
function homeShare(params) { //首页分享海报
  http('api/shops/groupgoods/home_share', 'get', params)
}
function dsSearchList(params) { //总门店产品搜索
  http('api/realstore.product/search_list', 'get', params)
}
function courseList(params) { //课程列表
  http('api/realcourse.course/course_list', 'get', params)
}
function lessonDetail(params) { //课程详情
  http('api/realcourse.course/detail', 'get', params)
}
function lessonMemberLists(params) { //用户列表
  http('api/realcourse.member/lists', 'get', params)
}
function userCommitOrder(params) { //购买课程
  http('api/realcourse.order/userCommitOrder', 'post', params)
}
function lessonMemberDetail(params) { //参训人员详情
  http('api/realcourse.member/detail', 'get', params)
}
function addLessonMember(params) { //添加参训人员
  http('api/realcourse.member/add', 'post', params)
}
function updateLessonMember(params) { //修改默认参训人员
  http('api/realcourse.member/setDefault', 'post', params)
}
function editLessonMember(params) { //修改参训人员
  http('api/realcourse.member/edit', 'get', params)
}
function dateList(params) { //课程安排列表
  http('api/realcourse.order/date_list', 'get', params)
}
function changeDate(params) { //修改课程日期
  http('api/realcourse.order/change_date', 'post', params)
}
function courseOrderDetail(params) { //订单详情
  http('api/realcourse.order/courseOrderDetail', 'get', params)
}
function lessonShare(params) { //课程分享
  http('api/realcourse.course/share', 'post', params)
}
function delLessonMember(params) { //删除默认参训人员
  http('api/realcourse.member/del', 'get', params)
}
function ds_getMerPic(params) { //获取门店轮播图
  http('api/realstore.store/getMerPic', 'get', params)
}
function ds_stores(params) { //获取门店列表（用户）
  http('api/realstore.store/stores', 'get', params)
}
function ds_store(params) { //获取门店信息（用户）
  http('api/realstore.store/store', 'get', params)
}
function ds_nearstores(params) { //最近门店（按经纬度）
  http('api/realstore.store/nearstores', 'get', params)
}
function ds_product_list(params) { //产品列表（用户）
  http('api/realstore.product/product', 'get', params)
}
function ds_storeindex(params) { //用户门店购物车
  http('api/realstore.usercart/storeindex', 'get', params)
}
function ds_storeshare(params) { //用户门店分享
  http('api/realstore.store/share', 'get', params)
}
function courseOrder_list(params) { //线下课程订单列表
  http('api/realcourse.order/courseOrder', 'get', params)
}
function ds_order_userorder(params) { //用户获取订单列表
  http('api/realstore.order/userorder', 'get', params)
}
function ds_order_userorderdetail(params) { //用户获取订单详情
  http('api/realstore.order/userorderdetail', 'get', params)
}
function ds_order_pay(params) { //支付接口
  http('api/realstore.pay/realstorePay', 'post', params)
}
function ds_order_userreceipt(params) { //确认收货（用户）
  http('api/realstore.order/userreceipt', 'get', params)
}
function technician_list(params) { //技师列表
  http('api/realstore.technician/lists', 'get', params)
}
function server_detail(params) { //门店服务详情
  http('api/realstore.server/detail', 'get', params)
}
function server_list(params) { //门店服务列表
  http('api/realstore.server/server', 'get', params)
}
function server_category_list(params) { //获取服务类型
  http('api/realstore.server/category_list', 'get', params)
}
function userPreServerOrder(params) { //购买服务预提交
  http('api/realstore.order/userPreServerOrder', 'get', params)
}
function userCommitServerOrder(params) { //服务订单确认
  http('api/realstore.order/userCommitServerOrder', 'post', params)
}
function serverOrder(params) { //服务订单列表
  http('api/realstore.order/serverOrder', 'get', params)
}
function serverOrderDetail(params) { //服务订单详情
  http('api/realstore.order/serverOrderDetail', 'get', params)
}
function cancel_server(params) { //取消订单
  http('api/realstore.order/cancel_server', 'get', params)
}
function getgoodslist(params) { //获取参与拼单商品列表
  http('api/groupshop/good/getgoodslist', 'get', params)
}
function getgoodsdetail(params) { //获取商品详细信息
  http('api/groupshop/good/getgoodsdetail', 'get', params)
}
function getTeamList(params) { //获取拼团团队列表
  http('api/groupshop/team/getTeamList', 'post', params)
}
function getTeamDetail(params) { //获取拼团团队详情
  http('api/groupshop/team/getTeamDetail', 'get', params)
}
function joinTeam(params) { //加入拼单
  http('api/groupshop/team/joinTeam', 'post', params)
}
function createTeam(params) { //创建拼单
  http('api/groupshop/team/createTeam', 'post', params)
}
function getOrderList(params) { //获取订单列表
  http('api/groupshop/team/getOrderList', 'post', params)
}
function forGood(params) { //领取实物产品
  http('api/groupshop/team/forGood', 'post', params)
}
function forVouchers(params) { //兑换购物券
  http('api/groupshop/team/forVouchers', 'post', params)
}
function team_share(params) { //分享海报
  http('api/groupshop/team/share', 'get', params)
}
function getNotice(params) { //抢单规则说明
  http('api/groupshop/team/getNotice', 'get', params)
}
function groupGoodsList(params) { //团购商品列表
  http('addons/litestore/api.groupgoods/list', 'get', params)
}
function groupGoodsDetail(params) { //周期购商品详情
  http('addons/litestore/api.groupgoods/detail', 'get', params)
}
function groupGoods_buyNow(params) { //周期购预下单
  http('addons/litestore/api.grouporder/buyNow', 'get', params)
}
function group_buyNow_pay(params) { //周期购确认下单
  http('addons/litestore/api.grouporder/buyNow_pay', 'get', params)
}
function groupOrder_list(params) { //周期购订单列表
  http('addons/litestore/api.grouporder/lists', 'get', params)
}
function groupOrder_detail(params) { //周期购订单详情
  http('addons/litestore/api.grouporder/detail', 'get', params)
}
function groupOrder_finish(params) { //确认收货
  http('addons/litestore/api.grouporder/finish', 'get', params)
}


function mall_category(params) { //商城分类列表
  http('addons/litestore/api.category/Showlist', 'get', params)
}
function share_poster(params) { //分享海报
  http('api/home/share_poster', 'get', params)
}
function scoreLog(params) { //我的积分记录
  http('api/score.home/scoreLog', 'get', params)
}

function bawjToMoney(params) { //百旺金出售
  http('api/score.home/bawjToMoney', 'post', params)
}
function get_log(params) { //滚动拼赚消息
  http('api/groupshop/good/get_log', 'get', params)
}
function edit_switch(params) { //开启自动参团
  http('api/groupshop/good/edit_switch', 'get', params)
}
function is_switch(params) { //是否开启自动参团
  http('api/groupshop/good/is_switch', 'get', params)
}
function get_poster(params) { //获取拼赚专区轮播图
  http('api/groupshop/good/get_poster', 'post', params)
}
function get_reward(params) { //滚动拼赚消息
  http('api/groupshop/good/get_reward', 'get', params)
}
function recharge(params) { //充值百旺金豆
  http('api/groupshop/team/recharge', 'post', params)
}
function fightGoods_share(params) { //抢单商品分享
  http('api/groupshop/team/goods_share', 'post', params)
}
function user_guide(params) { //新手指引
  http('api/index/article_list', 'get', params)
}
function fightListShow(params) { //抢赚显隐
  http('api/groupshop/good/is_show', 'get', params)
}
function vipPoster(params) { //vip中心背景图
  http('api/vipcenter/get_poster', 'get', params)
}
function coursePoster(params) { //线下课程背景图
  http('api/realcourse/course/get_poster', 'get', params)
}
function user_guideInfo(params) { //新手指引详情
  http('api/index/article_detail', 'get', params)
}
function get_ranking(params) { //排行榜
  http('api/groupshop/team/get_ranking', 'get', params)
}
function bank_list(params) { //获取银行名称列表
  http('api/home/bank_list', 'get', params)
}
export default { // 暴露接口
  bank_list,
  get_ranking,
  user_guideInfo,
  vipPoster,
  coursePoster,
  fightListShow,
  user_guide,
  fightGoods_share,
  recharge,
  get_poster,
  get_reward,
  get_log,
  edit_switch,
  is_switch,
  scoreLog,
  bawjToMoney,
  share_poster,
  mall_category,
  mallGoodsInfo,
  groupOrder_list,
  groupOrder_detail,
  groupOrder_finish,
  groupGoodsList,
  groupGoodsDetail,
  groupGoods_buyNow,
  group_buyNow_pay,
  getgoodslist,
  getgoodsdetail,
  getTeamList,
  getTeamDetail,
  joinTeam,
  createTeam,
  forGood,
  forVouchers,
  team_share,
  getNotice,
  getOrderList,
  technician_list,
  server_detail,
  server_list,
  server_category_list,
  userPreServerOrder,
  userCommitServerOrder,
  serverOrder,
  serverOrderDetail,
  cancel_server,
  wechatLogin,
  wechatMobileLogin,
  liveBanner,
  liveHotSale,
  onLineList,
  mallGoodsInfo,
  mallBuyNow,
  addressList,
  addressDefault,
  addressDelete,
  addressAdd,
  searchRoom,
  addressDetail,
  addressEdit,
  mallAddCart,
  userInfo,
  userInfo2,
  userInviter,
  mallOrderNum,
  mallOrderList,
  mallOrderInfo,
  mallOrderReceived,
  mallOrderCancel,
  mallCartList,
  goodList,
  mallGoodsInfo,
  mallCartList,
  liveBooking,
  liveCancelBooking,
  mallSubCart,
  mallCartPay,
  mallCartDelete2,
  appVersion,
  mallBuyNowPay,
  getwechatlive,
  wxLiveShare,
  mallOrderPay,
  getWechatLiveInfo,
  dsProductDetail,
  dsUsercartAdd,
  dsUserPreProductOrder,
  dsAddressDefault,
  dsGetIndexMerPic,
  dsProductType,
  dsProductList,
  dsGetAdmin,
  dsOrderPostage,
  vcSlide,
  vcType,
  vcHot,
  vcHao,
  vcDetail,
  vc_course_pay,
  dsOrderUserCommitShop,
  dsOrderUserCommitCart,
  dsOrderPay,
  dsUsercartList,
  dsUcUserCartSum,
  dsUserPreCartOrder,
  mallCartBuyNow2,
  dsUsercartReduce,
  dsUcMuldelete,
  shopProfitDetail,
  uncollected,
  shopCenter,
  shopMallTeamorder,
  teamAssets,
  teamList,
  subsidyLog,
  addSubsidy,
  addSubsidy1,
  bindAlipay,
  sendSms,
  bindAlipay1,
  mallHome,
  userGuide,
  mallShopInfo,
  shopPackage,
  mallCateGoodsList,
  userWithdraw,
  userWithdraw1,
  returnApply,
  expressList,
  returnApply1,
  cancelReturn,
  returnPost,
  checkRecommender,
  bindPid,
  goodsShare,
  homeShare,
  dsSearchList,
  courseList,
  lessonDetail,
  lessonMemberLists,
  userCommitOrder,
  lessonMemberDetail,
  addLessonMember,
  updateLessonMember,
  editLessonMember,
  dateList,
  changeDate,
  courseOrderDetail,
  lessonShare,
  delLessonMember,
  ds_getMerPic,
  ds_stores,
  ds_store,
  ds_nearstores,
  ds_product_list,
  ds_storeindex,
  ds_storeshare,
  courseOrder_list,
  ds_order_userorder,
  ds_order_userorderdetail,
  ds_order_pay,
  ds_order_userreceipt
}