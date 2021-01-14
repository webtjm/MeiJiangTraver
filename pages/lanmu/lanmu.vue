<template>
	<view class="container">
		<view class="lanmu-item" v-for="(item, i) in list" :key="i" @click="$routerFun(item.url)">
			<image :src="$baseImgUrl()+item.picture" mode="aspectFill"></image>
			<view class="text">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: null,
				list: [],
				list1: [{
					picture: "1.5-background1.png",
					name: "特产推荐",
					url: "../list4/list4?type=2"
				},{
					picture: "1.5-background2.png",
					name: "购物商店",
					url: "../list3/list3?type=4"
				},{
					picture: "1.5-background23.png",
					name: "娱乐场所",
					url: "../list3/list3?type=7"
				}],
				list2: [{
					picture: "1.6-background1.png",
					name: "旅游交通",
					url: "../list3/list3?type=3"
				},{
					picture: "1.6-background2.png",
					name: "游客服务中心",
					url: "../list3/list3?type=5"
				},{
					picture: "1.6-background3.png",
					name: "旅行社",
					url: "../list3/list3?type=6"
				}],
			};
		},
		onLoad(e) {
			this.type = e.type
			this.list = this[`list${this.type}`]
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.container{
		padding: 45upx;
		.lanmu-item{
			width: 100%;
			height: 240upx;
			position: relative;
			margin-bottom: 30upx;
			display: flex;
			flex-flow: column;
			align-items: center;
			justify-content: center;
			border-radius: 20upx;
			overflow: hidden;
			.text{
				font-size: 34upx;
				color: #fff;
				display: flex;
				align-items: center;
				&::before{
					display: flex;
					content: "";
					height: 3upx;
					width: 132upx;
					background-color: #FFFFFF;
					margin-right: 30upx;
				}
				&::after{
					display: flex;
					content: "";
					height: 3upx;
					width: 132upx;
					background-color: #FFFFFF;
					margin-left: 30upx;
				}
			}
			.en{
				font-size: 20upx;
				color: #fff;
			}
			image{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}
		}
		.tip{
			display: block;
			font-size: 22upx;
			color: $uni-text-color-grey;
			text-align: center;
		}
	}
</style>
