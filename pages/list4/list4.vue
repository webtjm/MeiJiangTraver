<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="list-box">
				<view class="item" v-for="(item, i) in dataList" @click="$routerFun(`../html/html?id=${item.id}`)">
					<view class="right">
						<image class="bg" :src="item.picture" mode="aspectFill"></image>
					</view>
					<view class="left">
						<view class="title">
							{{item.title}}
						</view>
						<view class="info info-right">
							<view class="time">
								{{$dateformat.timeTodate("Y-m-d",item.createTime)}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	var test = 0
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				type: "",
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
		onLoad(e) {
			this.type = e.type
			this.mescroll.resetUpScroll(false)
			this.getSwiper()
		},
		methods: {
			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let data = await this.$http.newsList({
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
	.list-box {
		padding: 0 40upx;
		margin-top: 40upx;

		.item {
			padding: 20upx;
			display: flex;
			flex-flow: column;
			justify-content: space-between;
			box-shadow: 0 2upx 21upx 0 rgba(82, 89, 87, 0.19);
			border-radius: 20upx;
			margin-bottom: 30upx;

			&:last-of-type {
				margin-bottom: 0;
			}

			.left {
				display: flex;
				flex-flow: column;
				justify-content: space-between;
				width: 100%;

				.title {
					width: 100%;
					font-size: 32upx;
					line-height: 42upx;
					max-height: 84upx;
					overflow: hidden; //一定要写
					text-overflow: ellipsis; //超出省略号
					display: -webkit-box; //一定要写
					-webkit-line-clamp: 1; //控制行数
					-webkit-box-orient: vertical; //一定要写
					margin: 10upx 0;
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
						}

						.text {
							width: 100%;
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
							width: 100%;
							font-size: 24upx;
							color: #999999;
							line-height: 34upx;
							max-height: 68upx;
							overflow: hidden; //一定要写
							text-overflow: ellipsis; //超出省略号
							display: -webkit-box; //一定要写
							-webkit-line-clamp: 1; //控制行数
							-webkit-box-orient: vertical; //一定要写
						}

						.time {
							margin-top: 10upx;
						}
					}
				}
			}

			.right {
				width: 100%;
				height: 280upx;
				position: relative;
				overflow: hidden;
				border-radius: 10upx;

				.bg {
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: -1;
				}

				.hot {
					width: 90upx;
					height: 44upx;
					position: absolute;
					bottom: 0upx;
					right: 0upx;
				}

				.comment {
					display: flex;
					align-items: center;
					position: absolute;
					bottom: 10upx;
					right: 10upx;

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
