<template>
	<view class="imt-audio">
		<view class="audio-wrapper">
			<image class="control-btn" :src="$baseImgUrl()+'icon-play.png'" v-if="paused" @click="operation"></image>
			<image class="control-btn" :src="$baseImgUrl()+'icon-pause.png'" v-if="!paused" @click="operation"></image>
			<view class="audio-number">{{currentTime}}</view>
			<slider class="audio-slider" activeColor="#CCC" block-size="10" :value="current" :max="duration" @changing="seek=true,current=$event.detail.value"
			 @change="change"></slider>
			<view class="audio-number">{{durationTime}}</view>
		</view>
		<!-- <view class="audio-control-wrapper" :style="{color:color}">
			<view class="audio-control audio-control-prev" v-if="control" :style="{borderColor:color}" @click="prev">&#xe601;</view>
			<view class="audio-control audio-control-switch" :class="{audioLoading:loading}" :style="{borderColor:color}" @click="operation">{{loading?'&#xe600;':(paused?'&#xe865;':'&#xe612;')}}</view>
			<view class="audio-control audio-control-next" v-if="control" :style="{borderColor:color}" @click="next">&#xe601;</view>
		</view> -->
	</view>
</template>

<script>
	const audio = uni.createInnerAudioContext(); //创建音频
	export default {
		data() {
			return {
				currentTime: '', //当前播放时间
				durationTime: '', //总时长
				current: '', //slider当前进度
				loading: false, //是否处于读取状态
				paused: true, //是否处于暂停状态
				seek: false //是否处于拖动状态
			}
		},
		props: {
			src: String, //音频链接
			autoplay: Boolean, //是否自动播放
			duration: Number, //总时长（单位：s）
			control: {
				type:Boolean,
				default:true
			}, //是否需要上一曲/下一曲按钮
			continue:Boolean,//播放完成后是否继续播放下一首，需定义@next事件
			color: {
				type:String,
				default:'#169af3'
			} //主色调
		},
		methods: {
			//返回prev事件
			prev() {
				this.$emit('prev')
			},
			//返回next事件
			next() {
				this.$emit('next')
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(
					Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//播放/暂停操作
			operation() {
				if (this.audio.paused) {
					console.log("sss")
					this.audio.play()
					this.loading = true
				} else {
					this.audio.pause()
				}
			},
			//完成拖动事件
			change(e) {
				this.audio.seek(e.detail.value)
			}
		},
		created() { 
			this.audio = uni.createInnerAudioContext(); 
			this.audio.src = this.src 
			this.current = 0 
			this.durationTime = this.format(this.duration) 
			this.audio.obeyMuteSwitch = false 
			this.audio.autoplay = this.autoplay 
			//音频进度更新事件 
			this.audio.onTimeUpdate(() => { 
				if (!this.seek) { 
					this.current = this.audio.currentTime } 
			}) 
			//音频播放事件 
			this.audio.onPlay(() => { 
				console.log("sss")
				this.paused = false 
				this.loading = false 
			}) 
			//音频暂停事件 
			this.audio.onPause(() => { 
				this.paused = true 
			}) 
			//音频结束事件 
			this.audio.onEnded(() => { 
				if (this.continue) { 
					this.next() 
				} else { 
					this.paused = true 
					this.current = 0 
				} 
			}) 
			//音频完成更改进度事件 
			this.audio.onSeeked(() => { 
				this.seek = false 
			}) 
		}, 
		beforeDestroy() { 
			if (this.audio) this.audio.destroy() 
		}, 
		watch: { 
			//监听音频地址更改 
			src(e) { 
				this.audio.src = e 
				this.current = 0 
				this.loading = true 
			}, 
			//监听总时长改变 
			duration(e) { 
				this.durationTime = this.format(e) 
			}, 
			//监听当前进度改变 
			current(e) { 
				this.currentTime = this.format(e) 
			} 
		}
	}
</script>

<style>
	@font-face {
		font-family: 'icon';
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot');
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff') format('woff'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.svg#iconfont') format('svg');
	}

	.imt-audio {
		padding: 30upx;
		background: #FFFFFF;
		border-radius: 10upx;
		box-shadow:0px 0px 16upx 0px rgba(33,34,34,0.12);
	}
	.control-btn{
		width: 50upx;
		height: 50upx;
		margin-right: 20upx;
	}
	.audio-wrapper {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border-radius: 8upx;
	}

	.audio-number {
		font-size: 24upx;
		line-height: 1;
		color: #333;
	}

	.audio-slider {
		flex: 1;
		margin: 0 30upx;
	}

	.audio-control-wrapper {
		margin-top: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "icon" !important;
	}

	.audio-control {
		font-size: 32upx;
		line-height: 1;
		border: 4upx solid;
		border-radius: 50%;
		padding: 16upx;
	}

	.audio-control-next {
		transform: rotate(180deg);
	}

	.audio-control-switch {
		font-size: 40upx;
		margin: 0 80upx;
	}

	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}
</style>