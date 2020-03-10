import Vue from 'vue'
import Router from 'vue-router'
import MENU from '@/components/menu'
import ScheduledList from '@/components/scheduled/list'
import DataVue from '@/components/scheduled/data'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MENU',
      component: MENU
    },{
      path:'/scheduled/list',
      name:'ScheduledList',
      component:ScheduledList
    },{
        path:'/scheduled/data',
        name:'DataVue',
        component:DataVue
    }
  ],
  mode:'hash'
})
