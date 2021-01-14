import http from "./interface.js"

var api = {}

// 用户登录
api.login = (code) => {
	return http.request({
		url: "user/login",
		method: "get",
		data: {
			code
		}
	})
}

// 用户最近浏览
api.getLog = () => {
	return http.request({
		url: "user/getLog",
		method: "get"
	})
}

// 修改用户信息
api.updateUser = (data) => {
	return http.request({
		url: "user/updateUser",
		method: "post",
		data
	})
}

// 获取用户信息
api.userInfo = () => {
	return http.request({
		url: "user/userInfo",
		method: "get"
	})
}

// 获取用户手机号码
api.getUserPhone = (data) => {
	return http.request({
		url: "user/getPhone",
		method: "post",
		data
	})
}

api.getBanner = (data) => {
	return http.request({
		url: "banner/getBanner",
		method: "get",
		data
	})
}

// 红黑榜列表
api.redblckList = () => {
	return http.request({
		url: "redblck/listRedBlack",
		method: "get"
	})
}

// 红黑榜详情
api.redblckDetail = (id) => {
	return http.request({
		url: "redblck/getRedBackInfo",
		method: "get",
		data: {
			id
		}
	})
}

// 公告列表
api.noticeList = () => {
	return http.request({
		url: "advisory/listAdvisory",
		method: "get",
		data: {
			page: 1,
			limit: 100
		}
	})
}

api.noticeOpen = () => {
	return http.request({
		url: "config/getAdvisory",
		method: "get"
	})
}

// 景区列表
api.jingquList = (data) => {
	return http.request({
		url: "scenic/listScenic",
		method: "get",
		data
	})
}

// 获取推荐景区
api.jingquRecommend = () => {
	return http.request({
		url: "scenic/getTopScenic",
		method: "get"
	})
}

// 获取全部景区
api.jingquAll = () => {
	return http.request({
		url: "scenic/getAllScenic",
		method: "get"
	})
}

// 景区详情
api.jingquDetail = (id) => {
	return http.request({
		url: "scenic/getScenicInfo",
		method: "get",
		data: {
			id
		}
	})
}

// 资讯列表 type类型(0游玩攻略 1乡村旅游 2视频 3红黑榜 4非遗传承 5文保单位 6文化活动 7精彩节庆 8赛事活动)
api.newsList = (data) => {
	return http.request({
		url: "activity/listActivity",
		method: "get",
		data
	})
}

// 资讯详情
api.newsDetail = (id) => {
	id = parseInt(id)
	return http.request({
		url: "activity/getActivityInfo",
		method: "get",
		data: {
			id,
			type: 0
		}
	})
}

api.newsDetailNotLog = (id) => {
	id = parseInt(id)
	return http.request({
		url: "activity/getActivityInfo",
		method: "get",
		data: {
			id,
			type: 1
		}
	})
}

// 轮播图 type类型(0乡村旅游 1游玩 2文化平远 3精彩节庆 4赛事活动)
api.swiperList = (type) => {
	return http.request({
		url: "swiper/getSwiper",
		method: "get",
		data: {
			type
		}
	})
}

// 酒店、驿站通用模块
/**
 * type: 类型(0驿站 1酒店 2饭店 3购物 4民宿 5加油站 6厕所 7停车场)
 * latitudeLongitude: 用户当前经纬度
 * **/
 // 模块列表
api.serviceList = (data) => {
	return http.request({
		url: "consume/listConsume",
		method: "get",
		data
	})
}

// 模块大类型列表
api.serviceByGroup = (data) => {
	return http.request({
		url: "consume/getAllConsume",
		method: "get",
		data
	})
}

// 模块详情
api.serviceDetail = (id) => {
	return http.request({
		url: "consume/getConsumeInfo",
		method: "get",
		data: {
			id
		}
	})
}

// 评价列表
api.commentList = (data) => {
	return http.request({
		url: "eva/listEvaluation",
		method: "get",
		data
	})
}

// 我的评价列表
api.myCommentList = (data) => {
	return http.request({
		url: "eva/listUserEvaluation",
		method: "get",
		data
	})
}

// 判断是否评价
api.hasComment = (typeId) => {
	return http.request({
		url: "eva/judge",
		method: "get",
		data: {
			typeId
		}
	})
}

// 提交评价
api.commentPub = (data) => {
	return http.request({
		url: "eva/evaluation",
		method: "post",
		data
	})
}

// 反馈列表
api.fankuiList = (data) => {
	return http.request({
		url: "comp/listComplaint",
		method: "get",
		data
	})
}

// 反馈详情
api.fankuiDetail = (id) => {
	return http.request({
		url: "comp/getComplaintInfo",
		method: "get",
		data: {
			id
		}
	})
}

// 提交反馈
api.fankuiPub = (data) => {
	return http.request({
		url: "comp/complaint",
		method: "post",
		data
	})
}

// 旅游小蜜
api.baiduAi = (data) => {
	return http.request({
		url: "unit/answer",
		method: "post",
		data
	})
}


export default api