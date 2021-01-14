<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :down="downOption" :up="upOption">
			<view class="daolan-content" v-if="list.length>0">
				<view class="item" v-for="(item, i) in list" @click="$routerFun(`../detail/detail?id=${item.id}`)">
					<view class="left">
						<view class="title">
							{{item.name}}
						</view>
						<view class="info">
							<view class="text-box">
								<view class="iconfont icon-phone icon" :style="{color: theme[type].color}"></view>
								<view class="text">
									电话：{{item.mobile}}
								</view>
							</view>
							<view class="text-box">
								<view class="iconfont icon-weizhi icon" :style="{color: theme[type].color}"></view>
								<view class="text">
									地址：{{item.address}}
								</view>
							</view>
						</view>
					</view>
					<view class="right">
						<image class="bg" :src="item.picture" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</mescroll-body>
		<!-- <view class="none-box" v-else>
			<text>没有找到“{{search}}”相关的地点</text>
			<image src="/static/images/none.png" mode="aspectFill"></image>
		</view> -->
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				list: [],
				search: "",
				downOption: {
					isLock: true
				},
				upOption: {
					auto: false,
					empty: {
						use: true,
						icon: this.$baseImgUrl()+'none.png'
					}
				}
			};
		},
		async onLoad(e) {
			this.search = e.search
			this.mescroll.resetUpScroll(false)
		},
		methods: {
			// 查看地图
			lookMap(item) {
				uni.openLocation({
					latitude: parseFloat(item.latitudeLongitude.split(',')[0]),
					longitude: parseFloat(item.latitudeLongitude.split(',')[1]),
				});
			},
			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				var {
					data
				} = await await this.$http.jingquList({
					name: this.search,
					page: pageNum,
					limit: pageSize
				})
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
				this.list = this.list.concat(data.records); //追加新数据

				// 请求成功,隐藏加载状态
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				setTimeout(() => {
					this.mescroll.endByPage(curPageLen, totalPage);
				}, 400)
			},
		}
	}
</script>

<style lang="scss">
	.none-box {
		margin-top: 50upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column;

		image {
			width: 200upx;
			height: 200upx;

		}

		text {
			font-size: 30upx;
			color: $uni-text-color-grey;
			margin-bottom: 30upx;
		}
	}

	.daolan-content {
		box-sizing: border-box;
		display: flex;
		flex-flow: column;
		width: 750upx;

		.item {
			padding: 40upx;
			border-bottom: 1upx solid #F1F1F1;
			display: flex;
			justify-content: space-between;

			&:last-of-type {
				border-bottom: 0;
			}

			.left {
				display: flex;
				flex-flow: column;
				justify-content: space-between;
				width: 390upx;

				.title {
					width: 100%;
					font-size: 32upx;
					line-height: 42upx;
					max-height: 84upx;
					overflow: hidden; //一定要写
					text-overflow: ellipsis; //超出省略号
					display: -webkit-box; //一定要写
					-webkit-line-clamp: 2; //控制行数
					-webkit-box-orient: vertical; //一定要写
				}

				.info {
					width: 100%;

					.text-box {
						width: 100%;
						display: flex;
						align-items: center;
						margin-bottom: 10upx;

						&:last-of-type {
							margin: 0;
						}

						.icon {
							font-size: 24upx;
							margin-right: 5upx;
							color: $uni-color-primary;
						}

						.text {
							width: 368upx;
							font-size: 24upx;
							color: #999999;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis; //超出省略号
						}
					}

					&.info-right {

						.text,
						.time {
							width: 368upx;
							font-size: 24upx;
							color: #999999;
							line-height: 34upx;
							max-height: 68upx;
							overflow: hidden; //一定要写
							text-overflow: ellipsis; //超出省略号
							display: -webkit-box; //一定要写
							-webkit-line-clamp: 2; //控制行数
							-webkit-box-orient: vertical; //一定要写
						}
					}
				}
			}

			.right {
				width: 260upx;
				height: 170upx;
				position: relative;

				.bg {
					border-radius: 20upx;
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: -1;
				}

				.hot {
					width: 80upx;
					position: absolute;
					top: 20upx;
					left: -8upx;
				}

				.comment {
					display: flex;
					align-items: center;
					position: absolute;
					bottom: 0;
					right: 0;
					height: 50upx;
					padding: 0 20upx;
					display: flex;
					width: 100%;
					box-sizing: border-box;
					background: rgba(0, 0, 0, 0.4);
					border-bottom-left-radius: 20upx;
					border-bottom-right-radius: 20upx;

					.text {
						font-size: 20upx;
						color: #FFFFFF;
					}

					image {
						width: 22upx;
						margin-left: 10upx;
					}
				}
			}
		}
	}
</style>
