<template>
	<view class="container">
		<view class="bg-box">
			<image :src="detail.picture" mode="aspectFill"></image>
			<view class="text-box">
				<text class="title">{{detail.title}}</text>
				<text class="time">{{$dateformat.timeTodate("Y-m-d",detail.createTime)}}</text>
			</view>
		</view>
		<view class="content-box">
			<view class="yuyin-box" v-if="detail.voice">
				<view class="">
					<imt-audio :src="detail.voice" :duration="detail.audioDuration" color="#fff" :control="false"></imt-audio>
				</view>
			</view>
			<view class="video-box" v-if="detail.video">
				<video style="width: 100%;" id="myVideo" :src="detail.video" controls></video>
			</view>
			<rich-text :nodes="html"></rich-text>
		</view>
	</view>
</template>

<script>
	var _self;
	var graceRichText = require("../../static/js/richText.js");
	import imtAudio from '@/components/imt-audio/imt-audio.vue'
	export default {
		data() {
			return {
				html : '',
				detail: {}
			};
		},
		async onLoad(e){
			if(e.type){
				var {data} = await this.$http.newsDetailNotLog(e.id)
				this.detail = data
				this.html = graceRichText.format(data.content);
			}else{
				var {data} = await this.$http.newsDetail(e.id)
				this.detail = data
				this.html = graceRichText.format(data.content);
			}
		},
		components: {
			imtAudio
		},
		methods: {
		}
	}
</script>

<style lang="scss">
.bg-box{
	width: 750upx;
	height: 518upx;
	position: relative;
	z-index: -1;
	image{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
	}
	.text-box{
		position: absolute;
		bottom: 120upx;
		left: 31upx;
		z-index: 2;
		display: flex;
		flex-flow: column;
		.title{
			font-size: 48upx;
			color: #fff;
			margin-bottom: 20upx;
		}
		.time{
			font-size: 24upx;
			color: #fff;
		}
	}
}
.content-box{
	padding: 31upx;
	border-radius: 16upx;
	position: relative;
	top: -50upx;
	background-color: #fff;
}
</style>
