<template>
	<view class="container">
		<view class="status-box">
			<text class="title">评分</text>
			<view :class="['item', statusidx==i?'active':'']" v-for="(item, i) in status" :key="i" @click="statusSelectTap(i)">
				<image :src="statusidx==i?item.act:item.no"></image>
				<text class="text">{{item.name}}</text>
			</view>
		</view>
		<view class="textarea-box">
			<textarea v-model="content" placeholder-style="color:#999" placeholder="请填写您的评价…" />
			<view class="tip">{{inputnum}}/{{textnum}}</view>
		</view>
		<view class="upload-box">
			<view class="item img-box" v-for="(item, i) in imgList" :key="i">
				<image :src="item" mode="aspectFill"></image>
				<view class="cuIcon cuIcon-delete delet-btn" @click="DelImg"></view>
			</view>
			<view class="item upload-btn" v-if="showupload" @click="ChooseImage">
				<image :src="$baseImgUrl()+'img_icon.png'" mode=""></image>
				<text class="text-bid">上传照片</text>
				<text class="text-small">0/3</text>
			</view>
		</view>
		<view class="confirm-btn"@click="commentPub">提交</view>
	</view>
</template>

<script>
	import baseurl from "@/tools/http/base.js"
	export default {
		data() {
			return {
				type: -1,
				typeId: -1,
				content: "",
				textnum: 100,
				statusidx: 0,
				manyiIcon: this.$baseImgUrl()+'icon-4-3.png',
				yibanIcon: this.$baseImgUrl()+'icon-4-2.png',
				bumanyiIcon: this.$baseImgUrl()+'icon-4-1.png',
				status: [
					{
						name: "满意",
						no: this.$baseImgUrl()+'icon-4-0.png',
						act: this.$baseImgUrl()+'icon-4-3.png',
						level: 0
					},
					{
						name: "一般",
						no: this.$baseImgUrl()+'icon-4-0.png',
						act: this.$baseImgUrl()+'icon-4-2.png',
						level: 1
					},
					{
						name: "不满意",
						no: this.$baseImgUrl()+'icon-4-0.png',
						act: this.$baseImgUrl()+'icon-4-1.png',
						level: 2
					}
				],
				imgList: [],
				showupload: true
			};
		},
		computed: {
			inputnum() {
			  if(this.content.length>=this.textnum){
				this.content=this.content.substr(0,this.textnum);
				uni.showToast({
					title: `最多只能输入${this.textnum}个字`,
					icon: "none"
				})
				return this.textnum;
			  }
			  return this.content.length == 0?0:this.content.length;
			}
		},
		watch: {
			imgList: {//深度监听，可监听到对象、数组的变化
				handler(val, oldVal){
					if(val.length==3){
						this.showupload = false
					}else{
						this.showupload = true
					}
				},
				deep:true //true 深度监听
			}
		},
		onLoad(e) {
			this.type = e.type
			this.typeId = e.typeid
		},
		methods: {
			statusSelectTap(idx){
				this.statusidx = idx
			},
			
			// 提交评价
			commentPub(){
				if(!this.content){
					uni.showToast({
						title: "请填写评价内容",
						icon: "none"
					})
					return
				}
				uni.showModal({
				    title: '提示',
				    content: '是否提交评价',
				    success: async (res) => {
				        if (res.confirm) {
							var res = await this.$http.hasComment(this.typeId)
							if(res.code!=0){
								uni.showToast({
									title: res.msg,
									icon: "none",
									duration: 1000
								})
							}else{
								var picture = await this.uploads()
								await this.$http.commentPub({
									"content": this.content,
									"level": this.status[this.statusidx].level,
									"picture": picture,
									"type": this.type,
									"typeId": this.typeId
								})
								uni.showToast({
									title: "评价成功",
									icon: "none",
									duration: 1000
								})
								setTimeout(() => {
									uni.navigateBack({
									    delta: 1
									});
								},1000)
							}
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			
			//小程序不支持多文件上传 
			uploads(){ 
				return new Promise(async resolve => {
					const that=this     
					let arr=[]
					for (let k in that.imgList) {
						arr[k] = await that.up_img(that.imgList[k])
					} 
					resolve(arr.join(','));
				})
			},
			up_img(url){ 
				console.log(url)
				return new Promise((resolve, reject) => {  
					uni.uploadFile({
						url: baseurl.url+'upload', //仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						header: {
							token:uni.getStorageSync("token")
						},
						formData: {
							user: "test"
						},
						success: (uploadFileRes) => {
							var data = JSON.parse(uploadFileRes.data)
							console.log(data)
							resolve(data.location);  
						}
					});
				})  
			},
			ChooseImage() {
				uni.chooseImage({
					count: 20, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res)
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						} 
						console.log(this.imgList)
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '删除',
					content: '确定要删除吗？',
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		padding: 31upx 31upx 50upx 31upx;
	}
	.status-box{
		display: flex;
		align-items: center;
		margin-bottom: 30upx;
		.title{
			font-size: 30upx;
			margin-right: 20upx;
		}
		.item{
			padding: 0upx 30upx;
			height: 64upx;
			display: flex;
			align-items: center;
			border:2upx solid #999;
			color: #999;
			border-radius:32upx;
			margin-right: 20upx;
			&:last-of-type{
				margin-right: 0;
			}
			&.active{
				color: $uni-color-primary;
				border:2upx solid $uni-color-primary;
			}
			.text{
				font-size: 30upx;
			}
			image{
				width: 38upx;
				height: 38upx;
				margin-right: 15upx;
			}
		}
	}
	.textarea-box{
		width: 100%;
		height: 278upx;
		position: relative;
		margin-bottom: 30upx;
		textarea{
			width: 100%;
			height: 100%;
			background-color: #F3F4F6;
			border-radius: 8upx;
			padding: 15upx 20upx;
			box-sizing: border-box;
			font-size: 24upx;
			color: #333333;
		}
		.tip{
			font-size: 24upx;
			color: #999;
			position: absolute;
			bottom: 15upx;
			right: 20upx;
		}
	}
	.upload-box{
		display: flex;
		margin-bottom: 30upx;
		.item{
			width: 218upx;
			height: 164upx;
			border-radius: 8upx;
			overflow: hidden;
			box-sizing: border-box;
		}
		.img-box{
			position: relative;
			margin-right: 17upx;
			&:last-of-type{
				margin-right: 0;
			}
			.delet-btn{
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				color: #fff;
				background-color: rgba(0,0,0,0.5);
				position: absolute;
				top: 50%;
				margin-top: -30upx;
				left: 50%;
				margin-left: -30upx;
				font-size: 20upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			image{
				width: 100%;
				height: 100%;
			}
		}
		.upload-btn{
			display: flex;
			flex-flow: column;
			align-items: center;
			box-sizing: border-box;
			padding: 20upx 0;
			justify-content: space-between;
			border:2upx dashed rgba(209,209,209,1);
			background:rgba(243,244,246,1);
			
			image{
				width: 42upx;
				height: 38upx;
			}
			text{
				color: #999;
			}
			.text-big{
				font-size: 24upx;
			}
			.text-small{
				font-size: 20upx;
			}
		}
	}
	.confirm-btn{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 96upx;
		font-size: 32upx;
		background: $uni-color-primary;
		color: #fff;
		text-align: center;
		line-height: 96upx;
		letter-spacing: 15upx;
	}
</style>
