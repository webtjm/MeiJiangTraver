<template>
	<view>
		<mescroll-body ref="mescrollRef" @up="upCallback" :down="downOption" :up="upOption">
			<view class="bg-box" v-if="swiperList.length">
				<view class="bg">
					<image :src="swiperList[swiperIdx].cover" mode=""></image>
				</view>
				<view class="swiper-container">
					<bw-swiper :swiperType="true" :swiperList="swiperList" imageKey="cover" :indicatorDots="false" :autoplay="false"
					 previousMargin="0rpx" nextMargin="120rpx" :scaleY="0.93" @change="swiperChange" style="width:100%"></bw-swiper>
				</view>
			</view>
			<view class="list-box" v-if="dataList.length>0">
				<view class="item" v-for="(item, i) in dataList" @click="$routerFun(`../detail/detail?id=${item.id}`)">
					<view class="right">
						<image class="bg" :src="item.picture" mode="aspectFill"></image>
					</view>
					<view class="left">
						<view class="title">
							{{item.name}}
						</view>
						<view class="tip">
							<text>{{item.sketch}}</text>
						</view>
						<view class="info info-right">
							<view class="text-box">
								<view class="iconfont icon-weizhi icon"></view>
								<view class="text">
									地址：{{item.address}}
								</view>
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
	import bwSwiper from "@/components/bw-swiper/bw-swiper.vue";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				type: "",
				swiperIdx: 0,
				swiperList: [],
				num: 1,
				dataList: [],
				downOption: {
					isLock: true
				},
				upOption: {
					auto: true,
					page: {
						num: 0,
						size: 6,
						time: null
					}
				}
			};
		},
		components: {
			bwSwiper
		},
		onLoad(e) {
			console.log(this.mescroll)
			// this.mescroll.resetUpScroll(false)
			this.getSwiper()
		},
		methods: {
			swiperChange(e){
				this.swiperIdx = e.detail.current
			},
			// 获取轮播图
			async getSwiper() {
				var {
					data
				} = await this.$http.swiperList(0)
				this.swiperList = data
			},

			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				var data = await this.$http.jingquList({
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
		display: flex;
		align-items: flex-end;

		.bg {
			width: 100%;
			height: 324upx;
			position: absolute;
			top: 0;
			left: 0;
			image{
				width: 100%;
				height: 100%;
				filter: blur(2px);
			}
		}
		
		.swiper-container{
			width: 100%;
			height: 312upx;
			padding-left: 30upx;
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
			height: 220upx;
			margin: 80upx 30upx;
			border-bottom: 1upx solid #F1F1F1;
			display: flex;
			justify-content: space-between;
			box-shadow:0 0 30upx 1upx rgba(33,33,34,0.14);
			border-radius:20upx;

			&:last-of-type {
				border-bottom: 0;
				margin-bottom: 0;
			}

			.left {
				display: flex;
				flex-flow: column;
				justify-content: center;
				flex: 1;
				padding: 20upx;
				box-sizing: border-box;

				.title {
					width: 100%;
					font-size: 28upx;
					overflow: hidden; //一定要写
					text-overflow: ellipsis; //超出省略号
					display: -webkit-box; //一定要写
					-webkit-line-clamp: 1; //控制行数
					-webkit-box-orient: vertical; //一定要写
				}
				
				.tip{
					color: $uni-color-primary;
					font-size: 22upx;
					margin: 10upx 0;
					text{
						margin-right: 15upx;
					}
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
							color: #999999;
						}

						.text {
							width: 368upx;
							font-size: 22upx;
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
				width: 220upx;
				height: 220upx;
				position: relative;

				.bg {
					border-radius: 20upx;
					position: absolute;
					bottom: 20upx;
					width: 100%;
					height: 240upx;
				}

				.hot {
					width: 80upx;
					position: absolute;
					top: 20upx;
					left: -8upx;
				}
			}
		}
	}
</style>
