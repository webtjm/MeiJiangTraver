<template>
	<view>
		<view class="title-box">
			<view class="bg">
				<uniSwiper :swiperList="swiperList" imgKey="cover" alignType="flex-start" :swiperHeight="523" :bottom="60"></uniSwiper>
			</view>
			<view class="content" v-if="detail">
				<view class="title">
					<view class="title-text-box">
						{{detail.name}}
					</view>
				</view>
				<view class="biaoqian">
					<view class="item" v-for="item in tags">
						{{item}}
					</view>

				</view>
				<view class="phone" @click="phoneTap">
					<view class="left">
						<image :src="$baseImgUrl()+'icon-Tel.png'" mode="aspectFill"></image>
						<text>联系电话</text>
					</view>
					<view class="right">
						{{detail.mobile}}
					</view>
				</view>
				<!-- <view class="phone" @click="phoneTap">
					<view class="left">
						<image :src="$baseImgUrl()+'icon-Time.png'" mode="aspectFill"></image>
						<text>开放时间</text>
					</view>
					<view class="right">
						123123123123
					</view>
				</view> -->
				<view class="phone" @click="phoneTap">
					<view class="left">
						<image :src="$baseImgUrl()+'icon-Add.png'" mode="aspectFill"></image>
						<text>{{detailType}}地址</text>
					</view>
					<view class="right">
						{{detail.address}}
					</view>
				</view>
				<view class="ditu" @click="lookMap">
					<map class="map" :latitude="latitude" :longitude="longitude" :markers="covers">
					</map>
					<cover-view class="title">{{detail.name}}</cover-view>
				</view>
				<view class="yuyin content-box" v-if="detail.voice">
					<view class="title">
						<view class="title-text-box">
							语音讲解
						</view>
					</view>
					<view class="yuyin-box">
						<imt-audio :src="detail.voice" :duration="1600" color="#fff" :control="false"></imt-audio>
					</view>
				</view>
				<view class="content-box">
					<view class="title">
						<view class="title-text-box no-border">
							<image :src="$baseImgUrl() + 'icon-my-1.png'" mode="widthFix"></image>
							{{detailType}}介绍
						</view>
					</view>
					<view class="jieshao">
						<rich-text :nodes="html"></rich-text>
					</view>
				</view>
				<view class="content-box pingjia" v-if="comments.length>0">
					<view class="title">
						<view class="title-text-box no-border">
							<image :src="$baseImgUrl() + 'icon-my-1.png'" mode="widthFix"></image>
							{{detailType}}评价
						</view>
						<view class="more" @click="$routerFun(`../pinglun/pinglun?id=${detail.id}`)">
							<text>更多</text>
							<image :src="$baseImgUrl()+'icon-youjiantou.png'" mode="widthFix"></image>
						</view>
					</view>
					<view class="pingjia-item" v-for="item in comments">
						<view class="info-box">
							<view class="atavar-box">
								<view class="atavar">
									<image :src="item.avator" mode="aspectFill"></image>
								</view>
								<text>{{item.nickName}}</text>
							</view>
							<view class="time">{{$dateformat.timeTodate("Y-m-d",item.createTime)}}</view>
						</view>
						<view class="pingjia-content">{{item.content}}</view>
						<view class="imgs" v-if="item.picture">
							<view class="img-box" v-for="(ele, idx) in item.picture" :key="idx" @click="$previewImg(item.picture, ele)">
								<image :src="ele" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="left">
						<view class="item" @click="pingjiaRouter">
							<image :src="$baseImgUrl() + 'icon-pinglun.png'"></image>
							<text>评论</text>
						</view>
						<view class="item">
							<image :src="$baseImgUrl() + 'icon-share.png'"></image>
							<text>分享</text>
							<button type="primary" open-type='share' class="share-btn"></button>
						</view>
					</view>
					<view class="right" @click="phoneTap">
						<image :src="$baseImgUrl() + 'icon-bohao.png'" mode="widthFix"></image>
						<text>一键拨号</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import imtAudio from '@/components/imt-audio/imt-audio.vue'
	var graceRichText = require("../../static/js/richText.js");
	import uniSwiper from "@/components/uni-swiper/uni-swiper.vue";
	export default {
		data() {
			return {
				detailType: "",
				id: 0,
				title: 'map',
				latitude: 0,
				longitude: 0,
				covers: [{
					latitude: 0,
					longitude: 0,
					width: 21,
					height: 30,
					iconPath: this.$baseImgUrl() + 'nav-map-pre.png'
				}],
				detail: null,
				comments: [],
				swiperList: [],
				tags: [],
				html: "",
			}
		},
		components: {
			imtAudio,
			uniSwiper
		},
		onShow() {
			this.getDetail()
			this.getComments()
		},
		onLoad(e) {
			this.id = e.id
			//0酒店宾馆,1民宿客栈,2农家饭店,3旅游交通,4购物场所,5游客服务中心,6旅行社,7娱乐场所
			var typeID = [{
				type: 0,
				typeName: "酒店"
			},{
				type: 1,
				typeName: "民宿"
			},{
				type: 2,
				typeName: "饭店"
			},{
				type: 3,
				typeName: "场所"
			},,{
				type: 4,
				typeName: "场所"
			},,{
				type: 5,
				typeName: "场所"
			},,{
				type: 6,
				typeName: "场所"
			},,{
				type: 7,
				typeName: "场所"
			}]
			if(e.type){
				typeID.forEach(item => {
					if(item.type == e.type) this.detailType=item.typeName
				})
			}else{
				this.detailType = "景区"
			}
			this.getDetail()
			this.getComments()
		},
		methods: {
			// 查看地图
			lookMap() {
				var latitude = parseFloat(this.detail.latitudeLongitude.split(',')[0])
				var longitude = parseFloat(this.detail.latitudeLongitude.split(',')[1])
				uni.openLocation({
					latitude,
					longitude
				});
			},
			// 拨号功能
			phoneTap() {
				wx.makePhoneCall({
					phoneNumber: this.detail.mobile // 仅为示例，并非真实的电话号码
				})
			},
			pingjiaRouter() {
				var type
				if (this.detailType == "景区") {
					type = 0
				} else {
					//  2酒店民宿 3休闲娱乐 4旅游服务
					var detailtype = this.detail.type
					if (detailtype == 0 || detailtype == 1) {
						type = 1
					} else if (detailtype == 4 || detailtype == 7) {
						type = 2
					} else if (detailtype == 3 || detailtype == 5 || detailtype == 6) {
						type = 3
					} else if (detailtype == 2) {
						type = 4
					}
				}
				this.$routerFun(`../pinglunForm/pinglunForm?type=${type}&typeid=${this.id}`)
			},
			async getDetail() {
				var data
				if (this.detailType == "景区") {
					data = await this.$http.jingquDetail(this.id)
				} else {
					data = await this.$http.serviceDetail(this.id)
				}
				this.detail = data.data
				var arr = this.detail.picture.split(',')
				this.swiperList = []
				arr.forEach(item => {
					this.swiperList.push({
						cover: item + ""
					})
				})
				this.html = graceRichText.format(this.detail.content);
				this.tags = this.detail.sketch.split('/')
				this.latitude = parseFloat(this.detail.latitudeLongitude.split(',')[0])
				this.longitude = parseFloat(this.detail.latitudeLongitude.split(',')[1])
				this.covers[0].latitude = this.latitude
				this.covers[0].longitude = this.longitude
			},

			// 获取景区评价
			async getComments() {
				var {
					data
				} = await this.$http.commentList({
					typeId: this.id,
					page: 1,
					limit: 3
				})
				data.records.forEach(item => {
					if (item.picture) {
						item.picture = item.picture.split(',')
					}
				})
				this.comments = data.records
			}
		}
	}
</script>

<style lang="scss">
	.title-box {
		height: 494upx;
		position: relative;

		.bg {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}

		.content {
			z-index: 2;
			border-radius: 0 80upx 0 0;
			padding: 30upx 0;
			padding-top: 40upx;
			padding-bottom: 0;
			position: absolute;
			top: 460upx;
			left: 0;
			width: 100%;
			background-color: #FFFFFF;


			.title {
				padding: 0upx 30upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20upx;
				box-sizing: border-box;
				position: relative;
				.title-text-box{
					display: flex;
					align-items: center;
					font-size: 30upx;
					font-weight: bold;
					image{
						width: 30upx;
						height: auto;
						margin-right: 10upx;
					}
					&::before{
						content: "";
						display: flex;
						width: 6upx;
						height: 24upx;
						border-radius: 3upx;
						background-color: $uni-color-primary;
						margin-right: 10upx;
					}
					&.no-border{
						&::before{
							content: "";
							display: none;
						}
					}
				}
				.more{
					display: flex;
					font-size: 24upx;
					color: #999999!important;
					align-items: center;
					image{
						width: 12upx;
						margin-left: 10upx;
					}
				}
			}

			.biaoqian {
				display: flex;
				padding: 0upx 40upx;
				margin-bottom: 20upx;

				.item {
					padding: 5upx 10upx;
					background: rgba(41,124,254, 0.1);
					color: $uni-color-primary;
					font-size: 20upx;
					margin-right: 10upx;
					border-radius: 10upx;
				}
			}

			.phone {
				font-size: 24upx;
				color: #B4B4B4;
				display: flex;
				justify-content: space-between;
				padding: 20upx 30upx;
				border-bottom: 1upx solid #F1F1F1;
				.left{
					display: flex;
					align-items: center;
					image{
						width: 24upx;
						height: 24upx;
						margin-right: 10upx;
					}
				}
			}

			.opera {
				display: flex;
				position: absolute;
				top: 60upx;
				right: 40upx;

				.share-btn {
					position: absolute;
					width: 40upx;
					height: 90upx;
					background: none !important;
					border: 0 !important;
					top: 0upx;
					right: 0upx;

					&::after {
						border: 0 !important;
					}
				}

				.item {
					display: flex;
					flex-flow: column;
					justify-content: center;
					margin-right: 40upx;

					&:last-of-type {
						margin: 0;
					}

					image {
						width: 39upx;
						margin-bottom: 10upx;
					}

					text {
						font-size: 24upx;
					}
				}
			}

			.ditu {
				margin: 20upx 40upx;
				margin-top: 40upx;
				height: 200upx;
				box-sizing: border-box;
				border-radius: 20upx;
				overflow: hidden;
				position: relative;
				display: flex;
				align-items: flex-end;
				justify-content: center;

				.map {
					width: 100%;
					height: 100%;
					position: absolute;
				}

				.title {
					padding: 20upx 40upx;
					border-radius: 20upx;
					background-color: $uni-color-primary;
					font-size: 24upx;
					color: #FFFFFF;
				}
			}
		}
	}

	.yuyin {
		border-top: 20upx #F8F8F8 solid;
		margin-top: 40upx;
	}

	.content-box {
		padding: 30upx 0;
		border-bottom: 20upx #F8F8F8 solid;

		&:last-of-type {
			border-bottom: 0;
		}

		&:last-of-type {
			border-bottom: 0;
		}

		.title {
			padding: 0upx 30upx;
			display: flex;
			align-items: center;
			margin-bottom: 20upx;
			box-sizing: border-box;
		}

		.yuyin-box {
			padding: 0upx 40upx;
		}

		.jieshao {
			padding: 0 40upx;
		}

	}

	.pingjia {
		box-sizing: border-box;
		margin-top: 0;
		border-bottom: 0;

		.more {
			display: flex;
			align-items: center;
			justify-content: center;

			text {
				font-size: 24upx;
				color: #999999;
			}

			image {
				width: 20upx;
				height: auto;
			}
		}

		.pingjia-item {
			border-bottom: 1upx solid #F1F1F1;
			padding: 30upx 45upx;

			.info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20upx;

				.time {
					color: #999;
					font-size: 24upx;
				}

				.atavar-box {
					display: flex;

					align-items: center;

					.atavar {
						width: 60upx;
						height: 60upx;
						border-radius: 50%;
						overflow: hidden;
						margin-right: 20upx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					text {
						font-size: 30upx;
					}
				}
			}

			.pingjia-content {
				line-height: 40upx;
				font-size: 24upx;
			}

			.imgs {
				display: flex;
				flex-wrap: wrap;
				margin-top: 20upx;

				.img-box {
					width: 150upx;
					height: 150upx;
					margin-bottom: 15upx;
					border-radius: 8upx;
					overflow: hidden;
					margin-right: 15upx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
	
	.bottom{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30upx;
		
		.left{
			display: flex;
			.item{
				position: relative;
				display: flex;
				flex-flow: column;
				margin-right: 50upx;
				&:last-of-type{
					margin-right: 0;
				}
				.share-btn{
					position: absolute;
					width: 100%;
					height: 100%;
					background: none !important;
					border: 0 !important;
					top: 0upx;
					right: 0upx;
					
					&::after {
						border: 0 !important;
					}
				}
				image{
					width: 40upx;
					height: 40upx;
					margin-bottom: 10upx;
				}
				text{
					font-size: 24upx;
				}
			}
		}
		.right{
			padding: 20upx;
			border-radius: 36upx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: $uni-color-primary;
			image{
				width: 32upx;
				height: auto;
				margin-right: 20upx;
			}
			text{
				color: #FFFFFF;
				font-size: 26upx;
			}
		}
	}
</style>
