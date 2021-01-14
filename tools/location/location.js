import Vue from 'vue'
// 引入SDK核心类
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

import {TX_key} from '../consts/consts'
// 实例化API核心类
const qqmapsdk = new QQMapWX({
  key: TX_key // 必填
});

const getCityInfo = function (latitude, longitude){
	return new Promise((resolve, reject) => {
		//根据经纬度获取所在城市信息
		qqmapsdk.reverseGeocoder({
		  location: {
		    latitude: latitude,
		    longitude: longitude
		  },
		  success: function (data) {
		    console.log(data.result)
			resolve(data.result)
		  },
		  fail: function (error) {
		    reject(error)
		  }
		})
	})
}

export {
	getCityInfo
}