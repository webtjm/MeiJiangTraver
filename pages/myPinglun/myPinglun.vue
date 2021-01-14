<template>
	<view class="container">
		<scroll-view class="scroll-container" id="scroll-container" scroll-x scroll-with-animation v-if="brands.length > 1"
		 :scroll-into-view="'s' + currentIndex">
			<view :class="['scroll-item', { active: index == currentId }]" :id="'s' + index" v-for="(item, index) in brands"
			 :key="index" @tap="handleScroll(index)">
				<view class="text">{{item.name}}</view>
			</view>
		</scroll-view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :down="downOption" :up="upOption" top="85">
			<view class="comment-item" v-for="(item, i) in list" :key="i">
				<view class="user-info">
					<view class="left">
						<view class="atavar">
							<image :src="item.avator" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name">{{item.nickName}}</view>
							<view class="time">{{$dateformat.timeTodate("Y-m-d",item.createTime)}}</view>
						</view>
					</view>
					<image class="right" :src="$baseImgUrl()+'icon-2-3.png'" mode="aspectFill" v-if="item.level==0"></image>
					<image class="right" :src="$baseImgUrl()+'icon-2-2.png'" mode="aspectFill" v-if="item.level==1"></image>
					<image class="right" :src="$baseImgUrl()+'icon-2-1.png'" mode="aspectFill" v-if="item.level==2"></image>
				</view>
				<view class="content">{{item.content}}</view>
				<view class="imgs" v-if="item.picture">
					<view class="img-box" v-for="(ele, idx) in item.picture" :key="idx" @click="$previewImg(item.picture, ele)">
						<image :src="ele" mode="aspectFill"></image>
					</view>
				</view>
				<view class="comment-ref" @click.stop="routerFun(item)">
					<view class="img-box">
						<image :src="item.typePicture" mode="aspectFill"></image>
					</view>
					<text>{{item.typeName}}</text>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				currentId: 0,
				/* 控制被选中 */
				currentIndex: "",
				/* 控制位置 */
				brands: [{
						name: '景区',
						type: 0,
						detailType: "景区"
					},
					{
						name: '酒店民宿',
						type: 1,
						detailType: "场所"
					},
					{
						name: '休闲娱乐',
						type: 2,
						detailType: "场所"
					},
					{
						name: '旅游服务',
						type: 3,
						detailType: "场所"
					},
					{
						name: '农家饭店',
						type: 4,
						detailType: "场所"
					}
				],
				list: [],
				downOption: {
					isLock: true
				}
			};
		},
		onLoad() {
			this.mescroll.resetUpScroll(false)
		},
		methods: {
			routerFun(item){
				var name
				this.brands.forEach(ele => {
					if(ele.type==item.type) name=ele.name
				})
				if(name!='景区'){
					uni.navigateTo({
						url: `../detail/detail?id=${item.typeId}&type=5`
					})
				}else{
					uni.navigateTo({
						url: `../detail/detail?id=${item.typeId}`
					})
				}
			},
			handleScroll(index) {
				this.currentId = index;
				this.currentIndex = Math.max(0, index - 1);
				this.mescroll.endDownScroll()
				this.mescroll.resetUpScroll(false)
			},

			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				var params = {
					type: this.brands[this.currentId].type,
					page: pageNum,
					limit: pageSize
				}
				var {
					data
				} = await this.$http.myCommentList(params)
				// 接口返回的当前页数据列表 (数组)
				let curPageData = data.current;
				// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
				let curPageLen = data.records.length;
				// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
				let totalPage = data.pages;
				// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
				let totalSize = data.total;

				//设置列表数据
				if (page.num == 1) this.list = []; //如果是第一页需手动置空列表
				data.records.forEach(item => {
					if (item.picture) {
						item.picture = item.picture.split(',')
					}
				})
				this.list = this.list.concat(data.records); //追加新数据

				// 请求成功,隐藏加载状态
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				setTimeout(() => {
					this.mescroll.endByPage(curPageLen, totalPage);
				}, 400)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.scroll-container {
		box-sizing: border-box;
		white-space: nowrap;
		height: 80upx;
		background: #fff;
		box-shadow: 0px 4upx 8upx 0px rgba(0, 0, 0, 0.07);
		padding: 0 20upx;
		position: fixed;
		top: 0;
		z-index: 10;


		.scroll-item {
			height: 80upx;
			text-align: center;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: calc(100%/4);
			font-size: 28upx;
			color: #333;
			position: relative;

			&.active {
				&::after {
					display: block;
					content: "";
					width: 44upx;
					height: 6upx;
					background: $uni-color-primary;
					border-radius: 4upx;
					position: absolute;
					bottom: 0;
					left: 50%;
					margin-left: -22upx;
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

	.comment-item {
		padding: 30upx;

		.user-info{
			display: flex;
			justify-content: space-between;
			margin-bottom: 10upx;
			.left{
				display: flex;
				.atavar{
					width: 90upx;
					height: 90upx;
					overflow: hidden;
					border-radius: 50%;
					margin-right: 15upx;
					image{
						width: 100%;
						height: 100%;
						
					}
				}
				.info{
					margin-top: 10upx;
					.name{
						font-size: 26upx;
						color: #999;
						margin-bottom: 10upx;
					}
					.time{
						font-size: 24upx;
						color: #999;
					}
				}
			}
			.right{
				width: 118upx;
				height: 40upx;
			}
		}

		.content {
			font-size: 26upx;
			color: #333333;
			line-height: 40upx;
			margin-bottom: 20upx;
		}

		.imgs {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 10upx;

			.img-box {
				width: 218upx;
				height: 164upx;
				margin-bottom: 15upx;
				overflow: hidden;
				margin-right: 18upx;

				&:last-of-type {
					margin-right: 0;
				}

				// &:nth-child(3n-2){
				// 	border-top-left-radius: 8upx;
				// 	border-bottom-left-radius: 8upx;
				// }
				// &:nth-child(3n+3){
				// 	border-top-right-radius: 8upx;
				// 	border-bottom-right-radius: 8upx;
				// }
				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.comment-ref {
			background: rgba(244, 244, 244, 1);
			border-radius: 8upx;
			display: flex;
			padding: 20upx;
			box-sizing: border-box;
			align-items: center;

			.img-box {
				width: 80upx;
				height: 80upx;
				border-radius: 8upx;
				overflow: hidden;
				margin-right: 15upx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			text {
				color: #666666;
				font-size: 26upx;
			}
		}
	}
</style>
