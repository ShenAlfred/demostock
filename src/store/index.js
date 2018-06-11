import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    StockCodeList: [],
    GroupList: [],
    scrollElements: {},
    scrollTop: 0,
    currentShowPanel: 0,
    expand: false,
    corpId: ''
  },
  getters: {
  }
})

export default store

