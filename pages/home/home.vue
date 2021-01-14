<template>
	<view class="container">
		<view class='bk-box'>
			<view class="weather-box" @click="$routerFun('../weatherDetail/weatherDetail')">
				<view class='pos-weather' v-if="wet">
					<image v-if="wet.wetCode == 100||wet.wetCode == 103" :src="icon[wet.wetCode]"></image>
					<icon v-else :class="['iconfont', `icon-weather-${wet.wetCode}`, 'weather-icon']"></icon>
					<text class='weather-desc'>{{wet.tmp}}℃</text>
				</view>
				<view class="pos">梅江区</view>
				<view class="tip">多彩梅江欢迎您</view>
			</view>
			<image class='header-bg' mode='aspectFill' :src="banner"></image>
			<view class="pos-search">
				<input v-model="search" placeholder-class='input-placeholder' confirm-type="search" placeholder="请输入目的地" />
				<image class='search-icon' :src="$baseImgUrl()+'icon-search.png'" mode="" @click="$routerFun(`../search/search?search=${search}`)"></image>
			</view>
		</view>
		<view class="serive-list">
			<template v-for="(item, idx) in serives">
				<view class="item" :style="{marginBottom: idx>3?0:'40rpx'}" @click="router(item.url)">
					<image :src="$baseImgUrl()+item.picture" mode="aspectFit"></image>
					<text>{{item.text}}</text>
				</view>
			</template>
		</view>
		<view class="notice-box" v-if="msgs.length>0">
			<image class="bg" :src="$baseImgUrl() + 'bg-gonggao.png'" mode=aspectFill></image>
			<uni-notice-bar :msgs="msgs"></uni-notice-bar>
		</view>
		<view class="swiper-box" v-if="swiperList.length>0">
			<view class="title-box">
				<view class="left">
					<view class="title">
						<text>景点列表</text>
						<image :src="$baseImgUrl() + 'icon-home-2.png'" mode="widthFix"></image>
					</view>
					<view class="tip">发现美好</view>
				</view>
				<view class="right" @click="$routerFun('../list1/list1')">
					<text>更多</text>
					<image :src="$baseImgUrl()+'icon-youjiantou.png'" mode="widthFix"></image>
				</view>
			</view>
			<view class="swiper-container">
				<bw-swiper :swiperType="true" :swiperList="swiperList" imageKey="picture" textKey="name" descKey="sketch" :indicatorDots="false" :autoplay="false"
				 previousMargin="150rpx" nextMargin="150rpx" :scaleX="0.8" :scaleY="0.8" @clickItem="swiperItemClick" style="width:100%"></bw-swiper>
			</view>
		</view>
		<view class="recommend">
			<view class="title-box">
				<view class="left">
					<view class="title">
						<text>当季热门</text>
						<image :src="$baseImgUrl() + 'icon-home-2.png'" mode="widthFix"></image>
					</view>
					<view class="tip">一路前行</view>
				</view>
				<view class="right" @click="$routerFun('../list4/list4?type=3')">
					<text>更多</text>
					<image :src="$baseImgUrl()+'icon-youjiantou.png'" mode="widthFix"></image>
				</view>
			</view>
			<view class="content">
				<template v-for="item in recommend">
					<view class="item" @click="$routerFun(`../html/html?id=${item.id}`)">
						<!-- <image class="hot" :src="$baseImgUrl()+'icons/hot1.png'" mode="widthFix"></image> -->
						<view class="item-box">
							<image class="bg" :src="item.picture" mode="aspectFill"></image>
							<view class="text">
								{{item.title}}
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		location,
		weather
	} from '@/tools/index.js'
	import {
		wetIcon
	} from '@/tools/weather/iconfont.js'
	import bwSwiper from '@/components/bw-swiper/bw-swiper.vue'
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		data() {
			return {
				banner: "",
				region: [],
				wet: null,
				icon: wetIcon,
				search: "",
				endSearch: null,
				swiperList: [],
				serives: [{
					picture: "menu-1.png",
					text: "景区游览",
					url: "../list1/list1"
				}, {
					picture: "menu-2.png",
					text: "酒店民宿",
					url: "../list2/list2?type=酒店民宿"
				}, {
					picture: "menu-3.png",
					text: "美食生活",
					url: "../list2/list2?type=美食生活"
				}, {
					picture: "menu-4.png",
					text: "休闲娱乐",
					url: "../lanmu/lanmu?type=1"
				}, {
					picture: "menu-5.png",
					text: "旅游服务",
					url: "../lanmu/lanmu?type=2"
				}, {
					picture: "menu-6.png",
					text: "游览攻略",
					url: "../list4/list4?type=0"
				}, {
					picture: "menu-7.png",
					text: "意见反馈",
					url: "../fankuiForm/fankuiForm"
				}, {
					picture: "menu-8.png",
					text: "便民服务",
					url: "../list4/list4?type=4"
				}],
				msgs: [],
				recommend: []
			}
		},
		components: {
			bwSwiper,
			uniNoticeBar,
		},
		async onLoad() {
			this.getBanner()
			this.getCityData()
			this.getJingquList()
			this.getNoticeList()
			this.getRecommend()
		},
		onShow() {
			this.search = ""
		},
		methods: {
			swiperItemClick(e){
				this.$routerFun(`../detail/detail?id=${e.id}`)
			},
			onShareAppMessage() {

			},
			router(url) {
				uni.navigateTo({
					url
				})
			},
			// 获取所在位置
			getLocation() {
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: 'wgs84',
						success: function(res) {
							resolve(res)
						}
					});
				})
			},
			
			async getBanner(){
				var {data} = await this.$http.getBanner({type:0})
				this.banner = data.cover
			},

			// 根据经纬度获取所在城市和天气
			getCityData() {
				return new Promise(async (resolve) => {
					let pos = {
						latitude: 24.316452,
						longitude: 116.123224
					}
					let city = await location.getCityInfo(pos.latitude, pos.longitude)
					this.region = [city.address_component.city]
					var wet = await weather.getTqByLocal(pos.latitude, pos.longitude)
					this.wet = {
						tmp: wet.now.tmp,
						wetCode: weather.getWeatherCode(wet.now.cond_code),
						wind: wet.now.wind_dir,
						cond_txt: wet.now.cond_txt
					}
					resolve()
				})
			},

			// 获取轮播图
			async getSwiper() {
				var {
					data
				} = await this.$http.swiperList(0)
				this.swiperList = data
				console.log(this.swiperList)
			},

			// 获取公告列表
			getNoticeList() {
				return new Promise(async (resolve) => {
					var {
						data
					} = await this.$http.noticeOpen()
					if (data && data.status == 0) {
						var {
							data
						} = await this.$http.noticeList()
						this.msgs = data.records
					}
					resolve()
				})
			},
			
			// 获取景区列表
			async getJingquList() {
				var {
					data
				} = await this.$http.jingquRecommend()
				this.swiperList = data
			},

			// 获取当季热门
			async getRecommend() {
				var {data} = await this.$http.newsList({
					type: 3,
					page: 1,
					limit: 6
				})
				this.recommend = data.records
			},
		}
	}
</script>

<style lang="scss">
	@import "/static/css/weather.css"; 
	.container{
		width: 750upx;
		overflow-x: hidden;
	}
	.bk-box {
		width: 750upx;
		height: 420upx;
		position: relative;
		padding: 0 30upx;
		box-sizing: border-box;
		padding-top: 33upx;
		display: flex;
		flex-flow: column;
		justify-content: flex-end;
		padding-bottom: 20upx;

		.header-bg {
			z-index: -1;
			position: absolute;
			top: 0;
			left: 0;
			height: 420upx;
			width: 100%
		}

		.weather-box {
			display: flex;
			flex-flow: column;
			margin: 0upx 0 20upx 0;
			color: #fff;

			.pos-weather {
				font-size: 40upx;
				width: 100%;
				display: flex;
				color: #fff;
				align-items: center;
				line-height: 35px;
				image {
					width: 35upx;
					height: 35upx;
				}

				.weather-icon {
					font-size: 30upx;
					margin-right: 10upx;
				}

				.weather-desc {
					font-size: 28upx;
					display: flex;
					align-items: center;
					margin-left: 10upx;
				}
			}
			
			.pos{
				font-size: 60upx;
			}
			
			.tip{
				font-size: 22upx;
			}

			.wind {
				font-size: 30upx;
				color: #fff;
				text-align: right;
			}
		}

		.pos-search {
			width: 100%;
			height: 72upx;
			background: rgba(255, 255, 255, 0.32);
			box-shadow: 0 4upx 12upx 0 rgba(0, 0, 0, 0.15);
			border-radius: 36upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			input {
				flex: 1;
				border-radius: 60upx;
				color: #fff;
				padding: 0 30upx;
				box-sizing: border-box;
				height: 100%;
				font-size: 24upx;
			}

			.input-placeholder {
				color: #fff;
			}

			.search-icon {
				width: 30upx;
				height: 32upx;
				margin-right: 30upx;
			}
		}
	}

	.swiper-box {
		.title-box{
			padding: 0 30upx;
		}
		.swiper-container{
			width: 100%;
			height: 540upx;
		}
	}

	.serive-list {
		padding: 40upx 10upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-flow: column;
			width: calc(100%/4);

			image {
				height: 68upx;
				margin-bottom: 10upx;
				z-index: -1;
			}

			text {
				font-size: 24upx;
			}
		}
	}

	.notice-box {
		padding: 20upx 30upx;
		background: #E6F0FE;
		position: relative;
		.bg{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			z-index: -1;
		}
	}
	
	.title-box{
		display: flex;
		height: 140upx;
		justify-content: space-between;
		.left{
			display: flex;
			align-items: center;
			.title {
				font-size: 30upx;
				font-weight: bold;
				position: relative;
				display: flex;
				flex-flow: column;
				position: relative;
			
				image {
					width: 70upx;
					height: 36upx;
					position: absolute;
					bottom: -15upx;
					left: 0;
				}
			}
			.tip{
				font-size: 22upx;
				color: $uni-color-primary;
				display: flex;
				align-items: flex-end;
				margin-left: 15upx;
			}
		}
		.right{
			display: flex;
			font-size: 24upx;
			color: #999999;
			align-items: center;
			image{
				width: 12upx;
				margin-left: 10upx;
			}
		}
	}

	.recommend {
		padding: 40upx;
		
		.content {

			.item {
				height: 312upx;
				width: 100%;
				position: relative;
				margin-bottom: 20upx;

				.hot {
					width: 92upx;
					position: absolute;
					top: 20upx;
					left: -10upx;
					z-index: -1;
				}

				.item-box {
					width: 100%;
					height: 100%;
					overflow: hidden;
					position: relative;
					border-radius: 20upx;
				}

				&:last-of-type {
					margin: 0;
				}

				.bg {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					z-index: -2;
				}

				.text {
					font-size: 28upx;
					color: #FFFFFF;
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					padding: 25upx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					box-sizing: border-box;
					background-color: rgba(0,0,0, 0.6);
				}
			}
		}
	}
</style>
