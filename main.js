import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import store from './store/index'
Vue.prototype.$store = store

import api from './tools/http/api.js'
Vue.prototype.$http = api

import dateformat from "@/tools/utils/utils.filter.js"
Vue.prototype.$dateformat = dateformat

Vue.prototype.$checkPhone = (phone) => {
	if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
		return false
	} else {
		return true
	}
}

Vue.prototype.$checkIdCard = (idcard) => {
	const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if (!regIdCard.test(idcard)) {
		return false;
	} else {
		return true;
	}
}

Vue.prototype.$previewImg = (arr, current) => {
	uni.previewImage({
		current,
		urls: arr,
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏']
		}
	});
}

// 在main.js注册全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

Vue.prototype.$routerFun = function(url, type) {
	console.log(url)
	if (!type) {
		uni.navigateTo({
			url
		})
	}
}

import base from './tools/http/base.js'
Vue.prototype.$baseImgUrl = () => {
	return base.img
}

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
