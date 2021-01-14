<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :down="downOption" :up="upOption">
			<view class="list-box" v-if="dataList.length>0">
				<view class="item" v-for="(item, i) in dataList" @click="$routerFun(`../detail/detail?type=${type}&id=${item.id}`)">
					<view class="left">
						<view class="title">
							{{item.name}}
						</view>
						<view class="info">
							<view class="text-box">
								<image :src="$baseImgUrl()+'icon-1.6-Tel.png'" mode="aspectFill"></image>
								<view class="text">
									电话：{{item.mobile}}
								</view>
							</view>
							<view class="text-box">
								<image :src="$baseImgUrl()+'icon-1.6-Add.png'" mode="aspectFill"></image>
								<view class="text">
									地址：{{item.address}}
								</view>
							</view>
						</view>
					</view>
					<view class="right" style="height: 170upx;">
						<image class="bg" :src="item.picture" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import uniSwiper from "@/components/uni-swiper/uni-swiper.vue";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				type: "",
				num: 1,
				dataList: [],
				downOption: {
					isLock: true
				},
				upOption: {
					auto: false,
					page: {
						num: 0,
						size: 6,
						time: null
					}
				}
			};
		},
		components: {
			uniSwiper
		},
		onLoad(e) {
			this.type = e.type
			this.mescroll.resetUpScroll(false)
		},
		methods: {

			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let data
				data = await this.$http.serviceList({
					type: this.type,
					page: pageNum,
					limit: pageSize
				})
				// 接口返回的当前页数据列表 (数组)
				let curPageData = data.data.current;
				// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
				let curPageLen = data.data.records.length;
				// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
				let totalPage = data.data.pages;
				// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
				let totalSize = data.data.total;

				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动置空列表
				this.dataList = this.dataList.concat(data.data.records); //追加新数据

				// 请求成功,隐藏加载状态
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				setTimeout(() => {
					this.mescroll.endByPage(curPageLen, totalPage);
				}, 400)
			}

		}
	}
</script>

<style lang="scss">
	.bg-box {
		height: 388upx;
		position: relative;

		.bg {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.content-box {
			position: relative;
			top: 180upx;
			padding: 0 40upx;

			.title-box {
				display: flex;
				flex-flow: column;

				.title {
					font-size: 48upx;
					color: #FFFFFF;
				}

				.en {
					font-size: 24upx;
					color: #FFFFFF;
				}
			}

			.desc-box {
				margin-top: 10upx;
				width: 670upx;
				height: 170upx;
				border-radius: 20upx;
				position: relative;
				padding: 20upx 70upx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				box-shadow: 0upx 2upx 21upx 0upx rgba(82, 89, 87, 0.19);
				box-sizing: border-box;

				.son-bg {
					position: absolute;
					top: 0;
					left: 0;
					z-index: -1;
					width: 670upx;
					height: 170upx;
				}

				.desc {
					font-size: 26upx;
					line-height: 44upx;
					// max-height: 88upx;
					// overflow:hidden;//一定要写
					// text-overflow: ellipsis;//超出省略号
					// display:-webkit-box;//一定要写
					// -webkit-line-clamp: 2;//控制行数
					// -webkit-box-orient: vertical;//一定要写
				}
			}
		}
	}

	.list-box {

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

						image {
							width: 26upx;
							height: 26upx;
							margin-right: 10upx;
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
				height: 190upx;
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
