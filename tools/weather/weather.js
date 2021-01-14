import {HF_key, HF_api} from '../consts/consts'

var type = {
	now: "now", //实况天气
	future: "forecast" //
}

//根据经纬度获取所在城市实况天气信息
const getTqByLocal = function (latitude, longitude){
	return new Promise((resolve, reject) => {
		uni.request({
		  url: HF_api+"now",
		  data: {
		    location: latitude + "," + longitude,
		    key: HF_key
		  },
		  success(response) {
			resolve(response.data.HeWeather6[0])
		  },
		  fail(err) {
			reject(err)
		  }
		})
	})
}

// 逐小时天气
const hourIntervalWeather = function (latitude, longitude){
	return new Promise((resolve, reject) => {
		uni.request({
		  url: HF_api+"hourly",
		  data: {
		    location: latitude + "," + longitude,
		    key: HF_key
		  },
		  success(response) {
			resolve(response.data.HeWeather6[0])
		  },
		  fail(err) {
			reject(err)
		  }
		})
	})
}

// 3-10天预报
const futureWeather = function (latitude, longitude){
	return new Promise((resolve, reject) => {
		uni.request({
		  url: HF_api+"forecast",
		  data: {
		    location: latitude + "," + longitude,
		    key: HF_key
		  },
		  success(response) {
			resolve(response.data.HeWeather6[0])
		  },
		  fail(err) {
			reject(err)
		  }
		})
	})
}

// 3-10天预报
const lifestyleWeather = function (latitude, longitude){
	return new Promise((resolve, reject) => {
		uni.request({
		  url: HF_api+"lifestyle",
		  data: {
		    location: latitude + "," + longitude,
		    key: HF_key
		  },
		  success(response) {
			resolve(response.data.HeWeather6[0])
		  },
		  fail(err) {
			reject(err)
		  }
		})
	})
}

//根据城市名字获取城市实况天气信息
const getTqByCityname = function (name) {
	return new Promise((resolve, reject) => {
		uni.request({
		  url: HF_api+"now",
		  data: {
		    location: name,
		    key: HF_key
		  },
		  success(response) {
		    resolve(response.data.HeWeather6[0])
		  },
		  fail(err) {
		    reject(err)
		  }
		})
	})
}

//判断实况天气code
const getWeatherCode = function(wetCode){
  if (wetCode >= 900 && wetCode <= 999) {
    wetCode = 999
  } else if (wetCode == 200 || (wetCode >= 200 && wetCode <= 204)) {
    wetCode = 200
  } else if (wetCode >= 205 && wetCode <= 208) {
    wetCode = 207
  } else if (wetCode == 213 || (wetCode >= 209 && wetCode <= 211)) {
    wetCode = 206
  } else if (wetCode == 502 || (wetCode >= 511 && wetCode <= 513)) {
    wetCode = 502
  } else if ((wetCode >= 500 && wetCode <= 501) || (wetCode >= 509 && wetCode <= 510) || (wetCode >= 514 && wetCode <= 515)) {
    wetCode = 501
  } else if (wetCode >= 507 && wetCode <= 508) {
    wetCode = 507
  } else if (wetCode >= 503 && wetCode <= 504) {
    wetCode = 504
  } else if (wetCode == 409 || (wetCode >= 402 && wetCode <= 403)) {
    wetCode = 409
  } else if (wetCode >= 404 && wetCode <= 406) {
    wetCode = 404
  } else if (wetCode == 401 || (wetCode >= 407 && wetCode <= 408)) {
    wetCode = 408
  } else if (wetCode == 400 || wetCode == 499) {
    wetCode = 499
  } else if (wetCode == 310 || wetCode == 316) {
    wetCode = 316
  } else if ((wetCode >= 317 && wetCode <= 318) || (wetCode >= 311 && wetCode <= 313)) {
    wetCode = 318
  } else if (wetCode >= 302 && wetCode <= 303) {
    wetCode = 302
  } else if (wetCode == 315 || (wetCode >= 300 && wetCode <= 301) || (wetCode >= 307 && wetCode <= 308)) {
    wetCode = 307
  } else if (wetCode == 306 || wetCode == 314) {
    wetCode = 306
  } else if (wetCode == 101 || (wetCode >= 103 && wetCode <= 104)) {
    wetCode = 103
  } else if (wetCode == 201 || wetCode == 100) {
    wetCode = 100
  } else if (wetCode == 305 || wetCode == 309 || wetCode == 399) {
    wetCode = 305
  } else {
    wetCode = wetCode
  }
  return wetCode
}

export {
	getTqByLocal,
	getTqByCityname,
	getWeatherCode,
	hourIntervalWeather,
	futureWeather,
	lifestyleWeather
}