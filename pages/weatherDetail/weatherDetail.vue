<template>
	<view class="container">
		<view class="top" v-if="weatherData">
			<view class="header">
				<view class="left">
					<view class="cuIcon-location pos-icon"></view>
					<view>{{region}}</view>
				</view>
				<view class="cuIcon-refresh" @click="reload"></view>
			</view>
			<view class="shikuang">
				<text class="wendu">{{weatherData.now.tmp}}°</text>
				<view class="weather">
					<image class="icon" :src="iconUrl+weatherData.now.cond_code+dn+'.png'"></image>
					<text>{{weatherData.now.cond_txt}}</text>
				</view>
				<view class="desc">
					<text>{{weatherData.now.wind_dir}}{{weatherData.now.wind_sc}}级</text>
					<text>体感温度{{weatherData.now.fl}}°</text>
					<text>相对湿度{{weatherData.now.hum}}%</text>
				</view>
			</view>
		</view>
		<view class="weather-params" v-if="weatherData">
			<view class="item">
				<text>降水</text>
				<text>{{weatherData.now.pcpn}}mm</text>
			</view>
			<view class="item">
				<text>湿度</text>
				<text>{{weatherData.now.hum}}%</text>
			</view>
			<view class="item">
				<text>{{weatherData.now.wind_dir}}</text>
				<text>{{weatherData.now.wind_sc}}级</text>
			</view>
			<view class="item">
				<text>气压</text>
				<text>{{weatherData.now.pres}}hpa</text>
			</view>
		</view>
		<view class="scroll-box" v-if="hourData">
			<text class="title">逐小时预报</text>
			<scroll-view class="scroll-view_H scroll-container" scroll-x="true">
				<view class="scroll-view-item_H scroll-item" style="width: calc(100%/6);" v-for="(item, i) in hourData.hourly" :key="i">
					<text>{{item.time}}时</text>
					<image class="icon" :src="iconUrl+item.cond_code+ item.tmp +'.png'"></image>
					<text>{{item.cond_txt}}</text>
				</view>
			</scroll-view>
		</view>
		<view class="scroll-box" v-if="futureData">
			<text class="title">未来7天预报</text>
			<scroll-view class="scroll-view_H scroll-container" scroll-x="true">
				<view class="scroll-view-item_H scroll-item" style="width: calc(100%/7);" v-for="(item, i) in futureData.daily_forecast">
					<text>{{item.date}}</text>
					<image class="icon" :src="iconUrl+item.cond_code_d+'d.png'"></image>
					<text>{{item.cond_txt_d}}</text>
				</view>
			</scroll-view>
		</view>
		<view class="zhishu" v-if="lifeData">
			<text class="title">生活指数</text>
			<view class="item" v-for="(item, i) in lifeData" :key="i">
				<text>{{item.key}}</text>
				<text>{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		location,
		weather
	} from '@/tools/index.js'

	function dnFun() {
		var now = new Date()
		var hour = now.getHours()
		if (hour > 6 && hour < 18) {
			return "d"
		} else {
			return "n"
		}
	}
	
	function formateIOS(time) {
	   var myDate = new Date((time.replace(/-/g, "/")))
	    return myDate
	}

	function getWeekDate(str) {
		var now = new Date(str);
		var day = now.getDay();
		var weeks = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
		var week = weeks[day];
		return week;
	}

	export default {
		data() {
			return {
				region: "",
				weatherData: null,
				iconUrl: "https://cdn.heweather.com/img/plugin/190516/icon/c/",
				dn: dnFun(),
				hourData: null,
				futureData: null,
				lifeData: null,
			};
		},
		async onLoad() {
			this.getCityData()
		},
		methods: {
			// loading状态获取所在经纬度
			getLocation() {
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '加载中'
					});
					uni.getLocation({
						type: 'wgs84',
						success: function(res) {
							resolve(res)
						}
					});
				})
			},
			
			reload(){
				this.getCityData()
			},

			// 根据经纬度获取所在城市和天气
			getCityData() {
				return new Promise(async (resolve) => {
					let pos = {
						latitude: 24.316452,
						longitude: 116.123224
					}
					let city = await location.getCityInfo(pos.latitude, pos.longitude)

					// 获取所在地
					this.region = [city.address_component.district]

					// 获取所在地天气
					this.weatherData = await weather.getTqByLocal(pos.latitude, pos.longitude)

					// 获取所在地逐小时天气
					this.hourData = await weather.hourIntervalWeather(pos.latitude, pos.longitude)
					if (this.hourData) {
						this.hourData.hourly.forEach(item => {
							item.time = formateIOS(item.time).getHours()
							if (item.time > 6 && item.time < 18) {
								item.tmp = "d"
							} else {
								item.tmp = "n"
							}
						})
					}
					console.log(this.hourData.hourly)

					// 获取所在地3-10天的天气
					this.futureData = await weather.futureWeather(pos.latitude, pos.longitude)
					if (this.futureData) {
						this.futureData.daily_forecast.forEach(item => {
							item.date = getWeekDate(item.date)
						})
					}

					// 获取所在地天气生活指数
					var lifeData = await weather.lifestyleWeather(pos.latitude, pos.longitude)
					var lifetype = {
						comf: "舒适度指数",
						drsg: "穿衣指数",
						sport: "运动指数",
						trav: "旅游指数",
						uv: "紫外线指数",
						air: "空气指数"
					}
					if(lifeData){
						this.lifeData = []
						for(var key in lifetype){
							lifeData.lifestyle.forEach(item => {
								if(key == item.type){
									this.lifeData.push({
										key: lifetype[key],
										text: item.brf
									})
								}
							})
						}
						
					}
					uni.hideLoading()
					resolve()
				})
			},


		}
	}
</script>

<style lang="scss">
	.container {
		.top {
			background: linear-gradient(to bottom, #297cfe 0%,#5db1ff 100%);;
			padding: 30upx;
			padding-bottom: 60upx;

			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #fff;
				font-size: 40upx;

				.left {
					display: flex;

					.pos-icon {
						line-height: 60upx;
						font-size: 35upx;
						margin-right: 20upx;
					}
				}
			}

			.shikuang {
				padding-top: 200upx;
				color: #fff;

				.wendu {
					display: flex;
					font-size: 120upx;
					margin-bottom: 30upx;
				}

				.weather {
					display: flex;
					align-items: center;

					image {
						width: 60upx;
						height: 60upx;
						margin-right: 10upx;
					}

					text {
						font-size: 40upx;
					}
				}

				.desc {
					display: flex;
					justify-content: space-between;
					font-size: 25upx;
					color: #fff;
					margin-top: 20upx;
				}
			}
		}

		.weather-params {
			padding: 30upx;
			display: flex;
			justify-content: space-between;

			.item {
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;

				text {
					font-size: 25upx;

					&:first-of-type {
						margin-bottom: 20upx;
						color: $uni-text-color-grey;
					}
				}
			}
		}

		.scroll-box {

			.title {
				color: $uni-text-color-grey;
				font-size: 28upx;
				padding: 30upx;
				display: flex;
				border-bottom: 1upx solid $uni-border-color;
			}

			.scroll-container {
				width: 100%;
				height: 160upx;
				padding: 30upx 0;
				padding-bottom: 0;
				white-space: nowrap;

				.scroll-item {
					display: inline-flex;
					height: 130upx;
					font-size: 25upx;
					flex-flow: column;
					justify-content: space-between;
					align-items: center;

					image {
						width: 50upx;
						height: 50upx;
					}
				}
			}
		}

		.zhishu {
			margin-bottom: 50upx;

			.title {
				color: $uni-text-color-grey;
				font-size: 28upx;
				padding: 30upx;
				display: flex;
				border-bottom: 1upx solid $uni-border-color;
			}

			.item {
				width: calc(100%/3);
				height: 200upx;
				display: inline-flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
				font-size: 25upx;
				border: 1upx solid $uni-border-color;
				box-sizing: border-box;
				border-top: 0;

				&:nth-child(3n+0) {
					border-left: 0;
					border-right: 0;
				}

				&:nth-child(3n+1) {
					border-right: 0;
				}

				&:nth-child(3n-1) {
					border-left: 0;
				}

				text {
					&:first-of-type {
						margin-bottom: 10upx;
						color: $uni-text-color-grey;
					}
				}
			}
		}
	}
</style>
