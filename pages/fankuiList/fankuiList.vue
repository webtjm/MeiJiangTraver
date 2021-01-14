<template>
	<view class="container">
		<scroll-view class="scroll-container" id="scroll-container" scroll-x scroll-with-animation v-if="brands.length > 1" :scroll-into-view="'s' + currentIndex">
			<view :class="['scroll-item', { active: index == currentId }]" :id="'s' + index" v-for="(item, index) in brands"
			 :key="index" @tap="handleScroll(index)">
				<view class="text">{{item.name}}</view>
			</view>
		</scroll-view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :down="downOption" :up="upOption" :top="85" :bottom="96">
		<view class="tousu-list">
			<view class="tousu-item" v-for="(item, i) in list" :key="i" @click="router(item.id)">
				<view class="item-container">
					<view class="title ellipse-line1">{{item.content}}</view>
					<view class="top">
						<view class="status done" v-if="item.status==1">已回复</view>
						<view class="status no" v-if="item.status==0">未回复</view>
					</view>
				</view>
				<view class="imgs" v-if="item.picture">
					<view class="img-box" v-for="(ele, idx) in item.picture" :key="idx" @click="$previewImg(item.picture, ele)">
						<image :src="ele" mode="aspectFill"></image>
					</view>
				</view>
				<view class="time">{{$dateformat.timeTodate("Y-m-d",item.createTime)}}</view>
				<view class="reply" v-if="item.status==1&&item.reply">
					<view class="content">
						<text>回复：</text>
						<text>{{item.reply}}</text>
					</view>
					<text class="time">{{$dateformat.timeTodate("Y-m-d",item.replyTime)}}</text>
				</view>
			</view>
		</view>
		</mescroll-body>
		<view class="btn" @click="$routerFun('../fankuiForm/fankuiForm')">
			新建反馈
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				currentId: 0,
				/* 控制被选中 */
				currentIndex: '',
				/* 控制位置 */
				brands: [
					{
						name: '景区',
						type: 0
					},
					{
						name: '酒店民宿',
						type: 1
					},
					{
						name: '休闲娱乐',
						type: 2
					},
					{
						name: '旅游服务',
						type: 3
					},
					{
						name: '农家饭店',
						type: 4
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
			router(id){
				uni.navigateTo({
					url: `../tousudetail/index?id=${id}`
				})
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
				var params
				var type = this.brands[this.currentId].type
				var {data} = await this.$http.fankuiList({
					type,
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
				},400)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.btn{
		width: 100%;
		height: 96upx;
		background-color: $uni-color-primary;
		color: #FFFFFF;
		font-size: 32upx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.scroll-container {
		box-sizing: border-box;
		white-space: nowrap;
		height: 90upx;
		background: #fff;
		box-shadow:0px 4upx 8upx 0px rgba(0,0,0,0.07);
		padding: 0 20upx;
		position: fixed;
		top: 0;
		z-index: 10;
		

		.scroll-item {
			height: 90upx;
			text-align: center;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: 30upx;
			color: #A8A8A8;
			position: relative;
			width: calc(100%/4);

			&.active {
				color: #011615;
				&::after{
					display: block;
					content: "";
					width:80upx;
					height:6upx;
					background:$uni-color-primary;
					border-radius:4upx;
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
	.tousu-list{
		padding: 0 30upx;
		margin-bottom: 108upx;
	}
	.tousu-item {
		border-bottom: 2upx solid #F1F1F1;
		padding: 30upx 0;
		&:last-of-type{
			border-bottom: 0;
		}
		.item-container{
			display: flex;
			justify-content: space-between;
		}
		.reply {
			background: rgba(244, 244, 244, 1);
			border-radius: 8upx;
			display: flex;
			padding: 20upx;
			box-sizing: border-box;
			display: flex;
			flex-flow: column;
			margin-top: 20upx;
			.content{
				margin-bottom: 15upx;
				color: #000000;
			}
			text {
				font-size: 26upx;
				&:last-of-type{
					margin-bottom: 0;
				}
			}
			.time{
				color: #999999;
				font-size: 24upx;
			}
		}
		.top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20upx;
			.status{
				width: 96upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				font-size: 28upx;
				&.done{
					color: $uni-color-primary;
				}
				&.no{
					color: #999999;
				}
			}
		}
		.title{
			font-size: 30upx;
			line-height: 40upx;
			margin-bottom: 15upx;
			width: 550upx;
		}
		.content{
			width: 550upx;
			font-size: 24upx;
			color: #999999;
			line-height: 30upx;
			max-height: 60upx;
			margin-bottom: 15upx;
		}
		.time{
			font-size: 24upx;
			color: #999999;
			max-height: 60upx;
			line-height: 30upx;
		}
		.imgs{
			display: flex;
			flex-wrap: wrap;
			margin-top: 20upx;
			.img-box{
				width: 173upx;
				height: 173upx;
				overflow: hidden;
				margin-right: 15upx;
				margin-bottom: 15upx;
				&:last-of-type{
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
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
