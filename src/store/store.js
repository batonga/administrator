import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  username:''
}
const mutations = {
  getUsername:(state, username) => {
    state.username=username
    localStorage.setItem('username', username)
  }
}
const actions = {}
const getters = {
  username: (state) => localStorage.getItem('username')
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
