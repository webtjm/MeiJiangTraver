<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="bg-box" v-if="swiperList.length">
				<uniSwiper style="width: 100%;" :swiperList="swiperList" imgKey="cover" :swiperHeight="323" :bottom="20"></uniSwiper>
			</view>
			<view class="tab">
				<view :class="['item', tabidx==i?'on':'']" v-for="(item, i) in tabs" @click="tabChange(i)">
					<image :src="$baseImgUrl()+'icon-1.3-a.png'" mode="aspectFill" v-if="tabidx==i"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<view v-if="list.length>0&&listStyleId==1">
				<wfalls-flow ref="wfalls" :list="list" :title="title" @finishLoad="getLoadNum"></wfalls-flow>
			</view>
			<view class="list-box-2" v-if="list.length>0&&listStyleId==2">
				<view class="item" v-for="(item, i) in list" @click="$routerFun(`../html/html?id=${item.id}`)">
					<view class="right">
						<image class="bg" :src="item.picture" mode="aspectFill"></image>
					</view>
					<view class="left">
						<view class="title">
							{{item.title}}
						</view>
						<view class="info info-right">
							<view class="text">
								{{item.sketch}}
							</view>
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
	import uniSwiper from "@/components/uni-swiper/uni-swiper.vue";
	import wfallsFlow from '@/components/wfalls-flow/wfalls-flow'
	import bwSwiper from '@/components/bw-swiper/bw-swiper.vue'
	import {
		mapState,
		mapActions,
		mapMutations,
		mapGetters
	} from "vuex"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				type: '',
				tabidx: 0,
				listStyleId: 1,
				tab1: [{
					name: "酒店宾馆",
					swiperType: 1,
					serviceType: 0
				}, {
					name: "民宿客栈",
					swiperType: 1,
					serviceType: 1
				}],
				tab2: [{
					name: "农家饭店",
					swiperType: 2,
					serviceType: 2
				}, {
					name: "特色美食",
					swiperType: 2,
					newsType: 1,
				}],
				tabs: [],
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
				},
				list: [],
				swiperList: []
			};
		},
		...mapState("service", [
			"serviceList"
		]),
		components: {
			uniSwiper,
			wfallsFlow
		},
		onLoad(e) {
			this.type = e.type
			if(e.type=='酒店民宿'){
				this.tabs = this.tab1
			}else if(e.type=='美食生活'){
				this.tabs = this.tab2
			}
			console.log(this.mescroll)
			this.mescroll.resetUpScroll(false)
			this.getSwiper()
		},
		methods: {
			tabChange(index) {
				this.tabidx = index
				this.mescroll.endDownScroll()
				this.mescroll.resetUpScroll(false)
				this.getSwiper()
			},
			// 获取轮播图
			async getSwiper() {
				var {
					data
				} = await this.$http.swiperList(this.tabs[this.tabidx].swiperType)
				this.swiperList = data
			},

			async upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				var loadTap = async () => {
					var res
					if(this.tabidx==1&&this.tabs[this.tabidx].newsType){
						this.listStyleId = 2
						res = await await this.$http.newsList({
							type: this.tabs[this.tabidx].newsType,
							page: pageNum,
							limit: pageSize
						})
					}else{
						this.listStyleId = 1
						res = await await this.$http.serviceList({
							type: this.tabs[this.tabidx].serviceType,
							page: pageNum,
							limit: pageSize
						})
					}
					return res.data
				}
				var data = await loadTap()
				console.log(data)
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
				console.log(this.list)
				this.$nextTick(function() {
					if (pageNum != 1) {
						this.$refs.wfalls.handleViewRender();
					}else{
						this.$refs.wfalls.init()
					}
				})

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
	.bg-box {
		position: relative;
		height: 323upx;

		.space {
			height: 150upx;
		}
	}

	.tab {
		display: flex;
		margin-top: 20upx;

		.item {
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #888888;
			font-size: 36upx;

			&.on {
				color: #282828;
				position: relative;
				
				image{
					width: 150upx;
					height: 26upx;
					position: absolute;
					bottom: 0;
					left: 50%;
					margin-left: -75upx;
				}

				text {
					z-index: 2;
				}
			}
		}
	}

	.my-swiper {
		width: 686upx;
		height: 248upx;
		margin-left: 32upx;
		border-radius: 20upx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		background-color: #FFFFFF;
		margin-top: 20upx;
	}

	.list-box {
		background-color: #FFFFFF;

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
					-webkit-line-clamp: 1; //控制行数
					-webkit-box-orient: vertical; //一定要写
				}

				.biaoqian {
					display: flex;

					text {
						padding: 5upx 10upx;
						background: rgba(1, 206, 208, 0.1);
						color: #01CED0;
						font-size: 20upx;
						margin-right: 10upx;
						border-radius: 10upx;
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
							color: #01CED0;
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
				height: 198upx;
				position: relative;
				border-radius: 20upx;
				overflow: hidden;

				.bg {
					position: absolute;
					width: 100%;
					height: 100%;
				}

				.hot {
					width: 80upx;
					position: absolute;
					top: 0upx;
					left: 0upx;
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
	.list-box-2 {
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
