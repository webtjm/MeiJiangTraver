<template>
	<view class="swiper">
		<view class="swiper-box" :style="{height: swiperHeight+'rpx'}">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="(swiper, i) in swiperList" :key="i" @click="router(swiper.typeId)">
					<image :src="swiper.cover" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="indicator" :style="{justifyContent: alignType, bottom: bottom +'rpx'}">
				<view class="dots" v-for="(swiper, index) in swiperList" :class="[currentSwiper == index ? 'on' : '']" :key="index"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			swiperList: {
				type: Array,
				default: []
			},
			swiperHeight: {
				type: Number,
				default: 248
			},
			alignType: {
				type: String,
				default: "center"
			},
			bottom: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				currentSwiper: 0,
			};
		},
		methods: {
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
				this.$emit("change", this.currentSwiper)
			},
			router(id) {
				uni.navigateTo({
					url: `/pages/detailstyle1/index?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		width: 100%;
		display: flex;
		justify-content: center;
		z-index: 1;
		overflow: hidden;

		.swiper-box {
			width: 100%;
			overflow: hidden;
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 100%;

				swiper-item {
					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.indicator {
				position: absolute;
				left: 0;
				display: flex;
				width: 100%;
				overflow: hidden;
				display: flex;
				padding: 20upx;
				box-sizing: border-box;

				.dots {
					width: 10upx;
					height: 10upx;
					background: #fff;
					border-radius: 50%;
					transition: all 0.3s ease-out;
					margin-right: 10upx;
					

					&.on {
						width: 28upx;
						height: 10upx;
						background: $uni-color-primary;
						border-radius: 6upx;
					}
				}
			}
		}
	}
</style>
