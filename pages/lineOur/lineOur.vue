<template>
	<view class="container">
		<image class="bg" :src="$baseImgUrl()+'us-background.png'" mode="aspectFill"></image>
		
		<view class="content">
			<view></view>
			<image class="title" :src="$baseImgUrl()+'mjqyly.png'" mode="widthFix"></image>
			<!-- <text @click="phoneTap">联系电话：12345 12301</text> -->
			<view class="text">
				  梅江区，原中央苏区县，“世界客都”梅州市的政治、经济、文化中心，全球客家人的精神家园。辖区总面积570.9平方公里，常住人口42万多人，旅居海外侨胞28万多人，是广东省重点侨乡。
				\n  这里江水婉转，山林秀美。梅江穿城而过，全区有海拔700米以上山峰5座，森林覆盖率71.3%，空气质量优良率97.8%，孕育出清凉山茶、雪莲果等丰美物产。近年来，梅江区城乡人居环境显著提升，区内拥有20多个城市公园和广场，梅江“一江两岸改造工程”被评选为联合国人居环境项目“优秀范例奖”。梅江区是国家园林城市、国家卫生城市、国家森林城市的主要组成部分。
				\n  这里江城悠久，诗画传承。梅江区是国家历史文化名城，千年前客家先民筑城江北，如今积淀成近1000座古民居、古建筑群，并孕育出35位将军、19位大学校长和10位“两院”院士，国家级非遗席狮舞等70多项非遗项目。“近代中国走向世界第一人”的清末“诗中泰斗”黄遵宪、中国现代艺术教育启蒙者林风眠等大批杰出名家奠定“诗画梅江”的厚重文化底蕴，支撑纳入国家级客家文化生态保护实验区。
				\n  这里风情浓郁，文旅兴旺。紧跟嘉应新区建设，梅江区大力发展城市休闲旅游产业，客天下景区成功创建国家4A级旅游景区和省级旅游度假区，投资10亿元建成文商旅融合高端休闲业态时光梅州。依托梅江一河两岸公园群，布局中国客家博物馆、广东汉剧院、梅州大剧院、世界客商中心等公共设施，形成高品质公共文化艺术游憩空间。梅江东岸每周上演被周总理誉为“南国牡丹”的广东汉剧和客家山歌剧，成为客都文化夜生活中心。
				\n  梅江建区30多年来，围绕“千年嘉应 诗画梅江”品牌，按照全域旅游示范区创建工作要求和市、区工作部署，努力打造世界客都文化旅游特色区、山水客都休闲城市旅游目的地，创全工作取得显著成效。先后荣获“中国优秀旅游城市”、“中国最佳文化生态旅游目的地”、“广东最受欢迎自驾游目的地”等多项国家和省级荣誉或称号。
				\n  投诉电话：12345 12301
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			// 拨号功能
			phoneTap() {
				wx.makePhoneCall({
					phoneNumber: this.detail.mobile // 仅为示例，并非真实的电话号码
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		position: relative;

		.bg {
			width: 100%;
			height: 670upx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.title{
			margin-top: 360upx;
			font-size: 60upx!important;
			margin-bottom: 40upx;
		}
		.content{
			padding: 0 50upx;
			view,text{
				font-size:30upx;
				line-height: 42upx;
				display: flex;
				color: #666666;
			}
			.title{
				width: 402upx;
				margin-bottom: 0;
			}
			.text{
				margin-top: 40upx;
			}
		}
	}
</style>
