import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
  //状态值
  let state = {
    //crud表单显示和隐藏
  }
  let getters = {
  }
  //处理数据（状态）变化
  let mutations = {
  }
  //处理异步请求，判断，流程控制
  let actions = {
  }


//导出store对象
export default new Vuex.Store({
  modules:{
    state,
    getters,
    mutations,
    actions
  }
 
});