<template>
	<view class="container">
		<view class="info-form">
			<view class="item">
				<view class="name">姓名</view>
				<input class="uni-input" v-model="name" placeholder-style="color:#DEDEDE" placeholder="请输入您的真实姓名" />
			</view>
			<view class="item">
				<view class="name">手机号码</view>
				<input class="uni-input" v-model="mobile" type="number" placeholder-style="color:#DEDEDE" placeholder="请输入您的联系方式" />
			</view>
			<view class="item">
				<view class="name">身份证号</view>
				<input class="uni-input" v-model="idcard" type="idcard" placeholder-style="color:#DEDEDE" placeholder="请输入您的有效身份证号" />
			</view>
			<view class="item">
				<view class="name">反馈类型</view>
				<view class="picker-box">
					<picker @change="pickChange" :value="pickIndex" :range="pickOptions" range-key="name">
						<view class="uni-input">{{pickOptions[pickIndex].name}}</view>
					</picker>
					<image class="icon" :src="$baseImgUrl()+'xiala.png'" mode="aspectFill"></image>
				</view>
			</view>
			<view class="item">
				<view class="name">反馈内容</view>
				<view class="textarea-box">
					<textarea v-model="content" placeholder-style="color:#DEDEDE" placeholder="请据实具体说明投诉事由…" />
					<view class="tip">{{inputnum}}/{{textnum}}</view>
				</view>
			</view>
			<view class="upload-box item" style="justify-content: flex-start;">
				<view class="name">反馈照片</view>
				<view class="imgs">
					<view class="img-item img-box" v-for="(item, i) in imgList" :key="i">
						<image :src="item" mode="aspectFill"></image>
						<view class="cuIcon cuIcon-delete delet-btn" @click="DelImg"></view>
					</view>
					<view class="img-item upload-btn" v-if="showupload" @click="ChooseImage">
						<image :src="$baseImgUrl()+'img_icon.png'" mode=""></image>
						<text class="text-big">上传照片</text>
						<text class="text-small">{{imgList.length}}/3</text>
					</view>
				</view>
			</view>
			
		</view>
		<view class="confirm-btn" @click="tousuPub">提交反馈</view>
	</view>
</template>

<script>
	import baseurl from "@/tools/http/base.js"
	export default {
		data() {
			return {
				tagid: "0",
				imgLen: 0,
				textnum: 50,
				content: "",
				name: "",
				mobile: "",
				idcard: "",
				imgList: [],
				showupload: true,
				pickIndex: 0,
				pickOptions: [{
					name: "景区",
					type: 0
				},{
					name: "酒店民宿",
					type: 1
				},{
					name: "休闲娱乐",
					type: 2
				},{
					name: "旅游服务",
					type: 3
				},{
					name: "农家饭店",
					type: 4
				},],
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
		methods: {
			pickChange(e) {
				var index = e.target.value
				this.pickIndex = index
				console.log(this.pickOptions[this.pickIndex])
			},
			async tousuPub(){
				if(!this.content){
					uni.showToast({
						title: "请填写反馈内容",
						icon: "none"
					})
					return
				}
				if(!this.name){
					uni.showToast({
						title: "请输入您的真实姓名",
						icon: "none"
					})
					return
				}
				if(!this.$checkPhone(this.mobile)){
					uni.showToast({
						title: "请输入正确的手机号",
						icon: "none"
					})
					return
				}
				if(!this.$checkIdCard(this.idcard)){
					uni.showToast({
						title: "请输入正确的身份证号码",
						icon: "none"
					})
					return
				}
				uni.showModal({
				    title: '提示',
				    content: '是否提交反馈',
				    success: async (res) => {
				        if (res.confirm) {
				            var picture = await this.uploads()
				            var params = {
				            	"content": this.content,
				            	"identity": this.idcard,
				            	"mobile": this.mobile,
				            	"name": this.name,
				            	"picture": picture,
				            	"type": this.pickOptions[this.pickIndex].type,
				            }
				            await this.$http.fankuiPub(params)
				            uni.showToast({
				            	title: "反馈成功",
				            	icon: "none"
				            })
							setTimeout(() => {
								uni.navigateBack({
								    delta: 1
								});
							},1000)
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
		padding: 40upx;
		.title{
			color: #333333;
			font-size: 36upx;
			margin-bottom: 30upx;
			font-weight: bold;
		}
		.textarea-box{
			position: relative;
			textarea{
				height: 280upx!important;
				box-sizing: border-box;
				font-size: 24upx;
				padding: 20upx!important;
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
			.imgs{
				display: flex;
			}
			.img-item{
				width: 163upx;
				height: 163upx;
				border-radius: 8upx;
				overflow: hidden;
				box-sizing: border-box;
			}
			.img-box{
				position: relative;
				margin-right: 15upx;
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
		.info-form{
			margin-bottom: 40upx;
			.item{
				display: flex;
				justify-content: space-between;
				padding: 20upx 0;
				position: relative;
				.name{
					font-size: 28upx;
					width: 150upx;
					height: 88upx;
					line-height: 88upx;
				}
				.icon{
					width: 22upx;
					height: 14upx;
					position: absolute;
					top: 54upx;
					right: 20upx;
				}
				.picker-box{
					.uni-input{
						width: 520upx;
						font-size: 28upx;
						background-color: #fff;
						height:80upx;
						line-height: 80upx;
						border:1upx solid rgba(205,205,205,1);
						border-radius:12upx;
						box-sizing: border-box;
						padding: 0 20upx;
					}
				}
				input, textarea{
					width: 520upx;
					font-size: 28upx;
					background-color: #fff;
					height:80upx;
					border:1upx solid rgba(205,205,205,1);
					border-radius:12upx;
					box-sizing: border-box;
					padding: 0 20upx;
				}
			}
			.tip{
				color: #999999;
				font-size: 20upx;
				margin-top: 15upx;
			}
		}
		.confirm-btn{
			width: 100%;
			line-height: 88upx;
			text-align: center;
			font-size: 32upx;
			background: $uni-color-primary;
			color: #fff;
			position: fixed;
			bottom: 0;
			left: 0;
		}
	}
</style>
