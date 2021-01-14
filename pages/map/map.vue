<template>
	<view class="container">
		<scroll-view class="scroll-container" id="scroll-container" scroll-x scroll-with-animation v-if="brands.length > 1"
		 :scroll-into-view="'s' + currentIndex">
			<view :class="['scroll-item', { active: index == currentId }]" :style="{width: `calc(100%/4)`}" :id="'s' + index"
			 v-for="(item, index) in brands" :key="index" @tap="handleScroll(index)">
				<view class="text">{{item.name}}</view>
			</view>
		</scroll-view>
		<view class="ditu-box" :style="{height: dituHeight+'px'}" v-if="dataList.length>0">
			<map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude" :markers="covers" :scale="12"
			 @markertap="coversClick" @tap="mapClick">
				<cover-view class="cover-box">
					<cover-view class="place"></cover-view>
					<cover-view class="scroll-view">
						<cover-view class="cover-item" v-for="(item, i) in dataList" :key="i" @click="router(item)">
							<cover-view class="text-box">
								<cover-view class="title">
									<cover-view class="text">{{item.name}}</cover-view>
									<!-- <cover-image v-if="i<=2" class="hot" src="/static/images/icons/hot_tag.png" mode=""></cover-image> -->
								</cover-view>
								<cover-view class="juli">{{item.distance>1000?`${Math.round(item.distance/1000)}km`:`${Math.round(item.distance)}m`}} | {{item.address}}</cover-view>
							</cover-view>
							<cover-image class="img-box" :src="item.picture" mode="aspectFill"></cover-image>
						</cover-view>
					</cover-view>
				</cover-view>
			</map>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations,
		mapGetters
	} from "vuex"
	export default {
		data() {
			return {
				dituHeight: 0,
				currentId: 0,
				/* 控制被选中 */
				currentIndex: '',
				/* 控制位置 */
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 24.316452,
				longitude: 116.123224,
				covers: [],
				dataList: [],
				brands: [{
					name: "景区",
					type: -1
				}, {
					name: "酒店民宿",
					type: 0
				}, {
					name: "休闲娱乐",
					type: 1
				}, {
					name: "旅游服务",
					type: 2
				}, {
					name: "农家饭店",
					type: 4
				}],
				typeName: "",
				tempList: []
			};
		},
		mounted() {
			this.getDituHeight()
			this.getCovers(-1)
		},
		methods: {
			router(item) {
				var type = this.brands[this.currentId].type
				if (type == -1) {
					this.typeName = ""
				} else {
					var num = item.type
					var arr = [{
						name: "酒店",
						type: 0
					}, {
						name: "民宿",
						type: 1
					}, {
						name: "场所",
						type: 5
					}, {
						name: "场所",
						type: 6
					}, {
						name: "场所",
						type: 7
					}, {
						name: "场所",
						type: 8
					}]
					arr.forEach(ele => {
						if (ele.type == num) {
							this.typeName = ele.name
						}
					})
				}
				this.$routerFun(`../detail/detail?id=${item.id}&type=${this.typeName}`)
			},
			handleScroll(index) {
				this.currentId = index;
				this.currentIndex = Math.max(0, index - 1);
				console.log(this.brands[index])
				this.getCovers(this.brands[index].type)
			},
			getDituHeight() {
				var that = this
				uni.getSystemInfo({
					success: function(res) {
						console.log(res)
						var mainHeight = res.windowHeight
						const query = uni.createSelectorQuery().in(that);
						query.select('#scroll-container').boundingClientRect(data => {
							console.log(data)
							var height = mainHeight - data.height
							that.dituHeight = height
						}).exec();
					}
				});
			},

			coversClick(e) {
				var id = e.markerId
				this.covers.forEach(item => {
					if (id == item.id) {
						item.width = 44
						item.height = 50
					}else{
						item.width = 34
						item.height = 39
					}
				})
				var arr = []
				this.dataList = this.tempList
				this.dataList.forEach(item => {
					if (id == item.id) {
						arr.push(item)
					}
				})
				this.dataList = []
				this.dataList = arr
			},

			mapClick(e) {
				var type = this.brands[this.currentId].type
				this.getCovers(type)
			},
			
			// 获取距离
			getDistance(lat1, lng1, lat2, lng2){
				lat1 = lat1 || 0;
				    lng1 = lng1 || 0;
				    lat2 = lat2 || 0;
				    lng2 = lng2 || 0;
				    var rad1 = lat1 * Math.PI / 180.0;
				    var rad2 = lat2 * Math.PI / 180.0;
				    var a = rad1 - rad2;
				    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				    var r = 6378137;
				    var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
				
				    // if (distance > 1000){
				    //   distance = Math.round(distance / 1000);
				    // }
				
				    return distance;
			},

			// 景区导览列表
			getCovers(type) {
				this.covers = []
				uni.getLocation({
					type: 'wgs84',
					success: async (res) => {
						console.log(res)
						// var latitudeLongitude = res.latitude + "," + res.longitude + ""
						var mylat = res.latitude
						var mylng = res.longitude
						var latitudeLongitude = '24.572625,115.897567'
						var type = this.brands[this.currentId].type
						var data = []
						if (type == -1) {
							data = await this.$http.jingquAll()
						} else {
							data = await this.$http.serviceByGroup({
								type
							})
						}
						this.dataList = data.data
						var iconPath = ""
						if (type == -1) {
							iconPath = this.$baseImgUrl() + 'ditu/jingqu.png'
						} else if (type == 0) {
							iconPath = this.$baseImgUrl() + 'ditu/jiudian.png'
						} else if (type == 1) {
							iconPath = this.$baseImgUrl() + 'ditu/yule.png'
						} else if (type == 2) {
							iconPath = this.$baseImgUrl() + 'ditu/fuwu.png'
						} else if (type == 4) {
							iconPath = this.$baseImgUrl() + 'ditu/jiudian.png'
						}
						this.dataList.forEach((item, i) => {
							var latitude = parseFloat(item.latitudeLongitude.split(',')[0])
							var longitude = parseFloat(item.latitudeLongitude.split(',')[1])
							var distance = this.getDistance(mylat, mylng, latitude, longitude)
							item.distance = distance
							if (i == 0) {
								this.latitude = latitude
								this.longitude = longitude
							}
							this.covers.push({
								id: item.id,
								latitude,
								longitude,
								iconPath,
								width: 34,
								height: 39
							})
						})
						this.tempList = this.dataList
					}
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		overflow-x: hidden;
	}
	.scroll-container {
		box-sizing: border-box;
		white-space: nowrap;
		height: 80upx;
		background: #fff;
		box-shadow: 0px 4upx 8upx 0px rgba(0, 0, 0, 0.07);
		padding: 0 20upx;


		.scroll-item {
			height: 80upx;
			text-align: center;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: 28upx;
			color: #333;
			position: relative;

			&.active {
				.text {
					color: $uni-color-primary;
				}

				&::after {
					display: block;
					content: "";
					width: 80upx;
					height: 5upx;
					background-color: $uni-color-primary;
					position: absolute;
					bottom: 0;
					left: 50%;
					margin-left: -40upx;
				}
			}
		}

		.bottom-border {
			margin: 0 auto;
			width: 50upx;
			height: 10upx;
			background: rgba(255, 79, 82, 1);
			border-radius: 5upx;
		}
	}

	.cover-box {
		width: 100%;
		position: absolute;
		right: 0upx;
		bottom: 0upx;
		background-color: #fff;
		border-radius: 16upx 16upx 0 0;
		display: flex;
		flex-flow: column;
		align-items: center;
		padding-top: 20upx;
		z-index: 1;

		.place {
			width: 70upx;
			height: 10upx;
			margin: 0upx 0 10upx 0;
			background-color: #E1E1E1;
			border-radius: 6upx;
		}

		.scroll-view {
			width: 100%;
			max-height: 405upx;
			padding: 20upx 0;
			box-sizing: border-box;
			overflow-y: scroll;
			padding-top: 0;

			.cover-item {
				margin: 0 60upx;
				width: 630upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: #fff;
				border-bottom: 2upx solid #EEEEEE;
				padding: 20upx 0;
				box-sizing: border-box;

				&:last-of-type {
					border-bottom: 0;
				}

				.img-box {
					width: 140rpx;
					height: 88upx;
					border-radius: 8upx;
					overflow: hidden;
				}

				.text-box {
					flex: 1;
					display: flex;
					flex-flow: column;
					justify-content: space-between;
					width: 450upx;
				}

				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					

					.text {
						font-size: 30upx;
						width: 450upx;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.juli {
					width: 450upx;
					font-size: 24upx;
					color: #999;
					margin-top: 10upx;
					overflow: hidden;
					text-overflow: ellipsis;

				}
			}
		}
	}
</style>
