<template>
	<view class="uni-swiper-msg">
			<view class="uni-swiper-msg-icon">
				<image :src="$baseImgUrl()+'icon-gonggao.png'" mode=""></image>
			</view>
			<view class="split"></view>
		   <swiper class="swiper" vertical="true" autoplay="false" duration="500" interval="2000">
				<swiper-item v-for="(item, index) in msgs" :key="index">
					      <view>{{item.sketch}}</view>
				</swiper-item>
			</swiper>
	</view>
</template>

<script>
	export default {
		name: 'UniNoticeBar',
		data() {
			return {
				
			}
		},
		props: {
			msgs: {
				type: Array,
				default: []
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-swiper-msg {
		flex-wrap: nowrap !important;
		display: flex !important;
		align-items: center;
		border-radius:8upx;
		height: 48upx;
		padding: 0 10upx;
			
		.uni-swiper-msg-icon {
			text-align: center;
			font-size: 28upx;
			color: #FB5755;
			border-radius:8upx;
			display: flex;
			align-items: center;
			image {
				width: 30upx !important;
				height: 30upx;
				flex-shrink: 0 !important;
			}
		}
		
		.split{
			width: 2upx;
			height: 28upx;
			background: #297CFE;
			margin: 0 20upx;
			z-index: 10;
		}

		.swiper {
			width: 100% !important;
			height: 48upx;
			swiper-item {
				view {
					overflow: hidden !important;
					white-space: nowrap !important;
					text-overflow: ellipsis !important;
					font-size: 24upx;
					color: #000;
					height: 48upx;
					line-height: 48upx;
				}
			}
		}
	}
</style>
