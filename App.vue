<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "colorui/icon.css";
	@import "static/css/icon.css";
	.ellipse-line1{
		overflow: hidden; //一定要写
		text-overflow: ellipsis; //超出省略号
		display: -webkit-box; //一定要写
		-webkit-line-clamp: 1; //控制行数
		-webkit-box-orient: vertical; //一定要写
	}
	.ellipse-line2{
		overflow: hidden; //一定要写
		text-overflow: ellipsis; //超出省略号
		display: -webkit-box; //一定要写
		-webkit-line-clamp: 2; //控制行数
		-webkit-box-orient: vertical; //一定要写
	}
	.container{
		width: 750upx;
		overflow: hidden;
	}
</style>
