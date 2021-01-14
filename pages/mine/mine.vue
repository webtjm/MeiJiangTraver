<template>
	<view class="container">
		<view class="info-box">
			<image class="bg" :src="$baseImgUrl()+'my-background.png'" mode="aspectFill"></image>
			<view class="atavar">
				<image :src="user.avator" mode="aspectFill"></image>
			</view>
			<view class="info">
				<text>{{user.nickName}}</text>
				<text v-if="user.mobile">{{user.mobile}}</text>
				<view class="phone-box" v-else>
					<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号码</button>
				</view>
			</view>
		</view>
		<view class="serive-list">
			<template v-for="(item, idx) in funList">
				<view class="item">
					<template v-if="item.name!='在线客服'">
						<view class="item-box" @click="$routerFun(item.url)">
							<image :src="$baseImgUrl()+item.img" mode="aspectFit"></image>
							<text>{{item.name}}</text>
						</view>
					</template>
					<template v-else>
						<view class="item-box">
							<image :src="$baseImgUrl()+item.img" mode="aspectFit"></image>
							<text>{{item.name}}</text>
						</view>
						<button v-show="item.name=='在线客服'" class="kefu" open-type="contact"></button>
					</template>
				</view>
			</template>
		</view>
		<view class="banner-box">
			<image :src="banner" mode="aspectFill"></image>
		</view>
		<view class="zuji">
			<view class="title-box">
				<view class="left">
					<view class="title">
						<text>我的足迹</text>
						<image :src="$baseImgUrl() + 'icon-home-2.png'" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="content">
				<template v-for="item in logs">
					<view class="item" @click="$routerFun(`../html/html?id=${item.activityId}&type=1`)">
						<!-- <image class="hot" :src="$baseImgUrl()+'icons/hot1.png'" mode="widthFix"></image> -->
						<view class="item-box">
							<image class="bg" :src="item.picture" mode="aspectFill"></image>
							<view class="text">
								{{item.activityName}}
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		<view class="authorize-contaner" v-show="showAuth">
			<view class='authorize-box'>
				<view class='uni-info'>
					<view class='atar'>
						<image :src="$baseImgUrl()+'xcx.png'" mode="aspectFill"></image>
					</view>
					<text>梅江旅游</text>
				</view>
				<view class='uni-tip'>
					<text class='title'>该程序获得以下权限:</text>
					<text class='tipcontent'>获得您的公开信息(昵称和头像等)</text>
				</view>
				<button class="mini-btn" open-type="getUserInfo" @getuserinfo="onGetUserInfo">确定授权</button>
			</view>
		</view>
	</view>
</template>

<script>
	import http from "@/tools/http/api.js"
	export default {
		data() {
			return {
				banner: "",
				logs:[],
				showAuth: false,
				hasUserInfo: false,
				user: {},
				timer: "",
				funList: [{
					name: "我的评价",
					img: 'icon-my-1.png',
					url: "../myPinglun/myPinglun"
				},{
					name: "我的反馈",
					img: 'icon-my-2.png',
					url: "../fankuiList/fankuiList"
				},{
					name: "在线客服",
					img: 'icon-my-3.png'
				},{
					name: "联系我们",
					img: 'icon-my-4.png',
					url: "../lineOur/lineOur"
				}]
			}
		},
		components: {
	
		},
		async onShow() {
			var {
				data
			} = await this.$http.userInfo()
			this.user = data
			
			this.getUserLog()
		},
		created() {
			this.getBanner()
			this.timer = setInterval(async () => {
				if (uni.getStorageSync("token")) {
					this.showAuth = false
					if (!this.hasUserInfo) {
						this.getUserTap()
					}
				} else {
					this.showAuth = true
				}
			}, 500)
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			async getBanner(){
				var {data} = await this.$http.getBanner({type:1})
				this.banner = data.cover
			},
			onGetUserInfo: (e) => {
				var userInfo = e.detail.userInfo
				uni.login({
					success: async res => {
						console.log(res)
						uni.showLoading({
							title: '授权中...'
						})
						var data = await http.login(res.code)
						console.log(data)
						if (data.code == 0) {
							uni.setStorageSync("token", data.token)
							http.updateUser({
								"avator": userInfo.avatarUrl,
								"nickName": userInfo.nickName,
								"sex": userInfo.gender
							})
							this.getUserTap()
						}
					},
					fail: res => {
						console.error(res.errMsg)
					},
					complete: res => {}
				})
			},
			
			async getPhoneNumber(e) {
				uni.checkSession({
					success: async (res) => {
						console.log(res)
						var data = {
							iv: e.detail.iv,
							encrypted: e.detail.encryptedData,
							token: uni.getStorageSync("token")
						}
						var {phone} = await http.getUserPhone(data)
						if(phone){
							this.user.mobile = phone
							await http.updateUser(this.user)
							this.getUserTap()
						}
					},
					fail: () => {
						uni.removeStorageSync("token")
					}
				})
			},
	
			// 获取用户信息
			async getUserTap(){
				var {
					data
				} = await this.$http.userInfo()
				console.log(data)
				this.user = data
				this.hasUserInfo = true
				uni.hideLoading()
			},
			
			// 我的足迹
			async getUserLog(){
				var {
					data
				} = await this.$http.getLog()
				console.log(data)
				this.logs = data
			}
		}
	}
</script>

<style lang="scss">
	.container{
		width: 750upx;
		overflow-x: hidden;
		padding: 30upx;
		box-sizing: border-box;
	}
	.banner-box{
		width: 100%;
		height: 168upx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 18upx;
		}
	}
	.zuji{
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
		.content{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.item{
				width: 324upx;
				height: 312upx;
				overflow: hidden;
				position: relative;
				border-radius: 20upx;
				margin-bottom: 40upx;
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
					background-color: rgba(18,56,113, 0.4);
				}
			}
		}
	}
	.info-box{
		width: 100%;
		height: 208upx;
		padding: 30upx 60upx;
		position: relative;
		display: flex;
		border-radius: 20upx;
		overflow: hidden;
		box-sizing: border-box;
		box-shadow:0upx 2upx 13upx 0upx rgba(0,145,145,0.48);
		align-items: center;
		.bg{
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			
		}
		.atavar{
			width: 110upx;
			height: 110upx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 30upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.info{
			height: 110upx;
			display: flex;
			flex-flow: column;
			justify-content: center;
			text{
				font-size: 28upx;
				color: #FFFFFF;
				&:first-of-type{
					margin-bottom: 10upx;
				}
			}
			.phone-box {
				font-size: 28upx;
				color: #333333;
				button{
					padding: 10upx;
					line-height: unset;
					font-size: 24upx;
					background-color: #FFFFFF;
					border: 0;
					color: $uni-color-primary;
					&::after{
						border: 0;
					}
				}
			}
		}
	}
	
	.serive-list {
		padding: 40upx 10upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	
		.item {
			position: relative;
			width: calc(100%/4);
			.kefu {
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
			.item-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-flow: column;
				
						
				image {
					height: 54upx;
					margin-bottom: 10upx;
					z-index: -1;
				}
						
				text {
					font-size: 24upx;
				}
			}
		}
	}
	
	.authorize-contaner {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.5);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 100%;
	}
	
	.authorize-box {
		background: #FFFFFF;
		display: flex;
		flex-flow: column;
		align-items: center;
		z-index: 1000;
		border-radius: 20upx;
		padding: 40upx;
	
		.uni-info {
			display: flex;
			width: 100%;
			flex-flow: column;
			align-items: center;
			margin-bottom: 20upx;
	
			.atar {
				width: 120upx;
				height: 120upx;
				border-radius: 50%;
				margin-bottom: 20upx;
				overflow: hidden;
			}
		}
	
		.uni-tip {
			display: flex;
			width: 100%;
			flex-flow: column;
			align-items: center;
	
			.tipcontent {
				color: $uni-text-color-grey;
				font-size: 24upx;
				margin-top: 10upx;
			}
		}
	
		button {
			width: 345upx;
			border: 0;
			border-radius: 20upx;
			background: $uni-color-primary;
			color: #fff;
			height: 80upx;
			font-size: 30upx;
			line-height: 70upx;
			padding: 0;
			margin-top: 40upx;
		}
	
		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
