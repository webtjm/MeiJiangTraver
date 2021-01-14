const state = {
	tabbarList: [{
			name: '首页',
			name_code: 'home',
			icon: '../../static/images/tabbar/home.png',
			select_icon: '../../static/images/tabbar/home_act.png',
			size: "small",
			color: "#666666",
			activeColor: "#333333"
		},
		{
			name: '',
			name_code: 'publish',
			icon: '../../static/images/tabbar/ditu.png',
			select_icon: '../../static/images/tabbar/ditu.png',
			size: 'big',
			color: "#666666",
			activeColor: "#333333"
		},
		{
			name: '个人',
			name_code: 'user',
			icon: '../../static/images/tabbar/center.png',
			select_icon: '../../static/images/tabbar/center_act.png',
			size: 'small',
			color: "#666666",
			activeColor: "#333333"
		}
	],
	now_page_index: 0
}

const mutations = {
	change_page(state, index) {
		state.now_page_index = index;
	}
}

const actions = {
	changePage({
		state,
		commit
	}, index) {
		commit('change_page', index)
	}
}

export default {
	state,
	mutations,
	actions
}
