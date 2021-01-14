<template>
	<view class="list-container">
		<view id="wf-list" class="list" v-for="(list,listIndex) of viewList" :key="listIndex">
			<view class="item" v-for="(item,index) of list.list" :key="index" @click="$routerFun(`../detail/detail?id=${item.id}&type=${item.type}`)">
				<image class="bg" :id="'id'+item.id" @load="handleViewRender" @error="handleViewRender" :src="item.picture" mode="widthFix"></image>
				<view class="desc-box">
					
					<view class="content">
						<view class="title">
							<text>{{item.name}}</text>
						</view>
						<view class="pos">
							<image :src="$baseImgUrl()+'icon-1.3-add.png'" mode="aspectFill"></image>
							<text>{{item.address}}</text>
						</view>
						<!-- <view class="desc">
							<text>联系电话：{{item.mobile}}</text>
						</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array, //实际请求获取的列表数据
			},
			title: {
				type: String
			}
		},
		data() {
			return {
				viewList: [{
					list: []
				}, {
					list: []
				}] //展示到视图的列表数据
			}
		},
		methods: {
			init() {
				this.viewList = [{
					list: []
				}, {
					list: []
				}];
				this.viewList[0].list = [this.list[0]]
			},
			handleViewRender() {
				const index = this.viewList.reduce((total, current) => total + current.list.length, 0)
				if (index > this.list.length - 1) {
					// 加载完成触发事件并返回加载过的图片数
					this.$emit('finishLoad', index)
					return
				};
				const query = uni.createSelectorQuery().in(this);
				let listFlag = 0;
				query.selectAll('#wf-list').boundingClientRect(data => {
					listFlag = data[0].bottom - data[1].bottom < 0 ? 0 : 1;
					this.viewList[listFlag].list.push(this.list[index])
				}).exec()
			},
		},
		mounted() {
			this.init()
		}
	}
</script>

<style lang="scss" scoped>
	.list-container {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0 24rpx;
		padding-top: 30rpx;

		.list {
			width: calc(50% - 12rpx);
			display: flex;
			flex-direction: column;

			.item {
				margin-bottom: 25rpx;
				box-shadow: 0px 4rpx 12rpx 0px rgba(0, 0, 0, 0.2);
				position: relative;
				border-radius:20upx;
				overflow: hidden;

				.bg {
					width: 100%;
					border-radius: 10upx 10upx 0 0;
				}
				
				.hot{
					width: 80upx;
					height: 40upx;
					position: absolute;
					top: 20upx;
					left: -10upx;
				}

				.desc-box {
					position: relative;
					padding: 10upx 20upx;
					display: flex;
					align-items: center;

					.content{
						.title{
							width: 100%;
							font-size: 32upx;
							line-height: 42upx;
							max-height: 84upx;
							overflow: hidden; //一定要写
							text-overflow: ellipsis; //超出省略号
							display: -webkit-box; //一定要写
							-webkit-line-clamp: 1; //控制行数
							-webkit-box-orient: vertical; //一定要写
							margin-bottom: 10upx;
						}
						.desc {
							width: 100%;
							font-size: 24upx;
							color: #999999;
							line-height: 42upx;
							max-height: 84upx;
							overflow: hidden; //一定要写
							text-overflow: ellipsis; //超出省略号
							display: -webkit-box; //一定要写
							-webkit-line-clamp: 1; //控制行数
							-webkit-box-orient: vertical; //一定要写
						}
					}
				}

				.pos {
					width: 100%;
					color: #9A9A9A;
					font-size: 30upx;
					display: flex;
					align-items: flex-start;
					justify-content: flex-start;
					box-sizing: border-box;
					text {
						line-height: 31upx;
						font-size: 22upx;
						&.hottext {
							max-width: 255upx;
						}
					}

					image {
						margin-right: 10upx;
						width: 25upx;
						height: 31upx;
					}
				}
			}
		}
	}
</style>
