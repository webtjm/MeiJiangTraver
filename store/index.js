import Vue from 'vue'
import Vuex from 'vuex'
import tabbar from './modules/tabbar'
import service from './modules/service.js'
import news from './modules/news.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    tabbar: {
      namespaced: true,
      ...tabbar
    },
	service: {
	  namespaced: true,
	  ...service
	},
	news: {
	  namespaced: true,
	  ...news
	},
  }
})

export default store