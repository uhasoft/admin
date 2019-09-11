// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './vuex/store'
// import router from './router'
import Router from 'vue-router';
import axios from 'axios';
Vue.prototype.$axios = axios;

import ElementUI from 'element-ui';
import { Loading } from 'element-ui'
Vue.use(ElementUI);
Vue.use(Router);

import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';   //浅绿色主题

// 引用API文件
import api from './api/index.js'
// 将API方法绑定到全局
Vue.prototype.$api = api;

// 全局函数
import base from './base'
Vue.use(base);
Vue.filter('date', function (value) {
  if(!value) return '';
  if(/[-]?[0-9]+/.test(value)){
    var date = new Date(value);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
      + ' ' + (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute) + ":" + (second < 10 ? '0' + second : second);
  }
});

Vue.config.productionTip = false;


api.get('/router/all', null, r=>{
  if(r.code === 0){
    let routers = [];
    for(let i = 0; i < r.data.length; i++){
      routers.push({
        path: r.data[i].url,
        component: resolve => require(['./views/' + r.data[i].template], resolve)
      })
    }
    const router = new Router({
      routes: [
        {
          path: '/',
          redirect: '/login'
        },
        {
          path: '/welcome',
          component: resolve => require(['./views/common/Home.vue'], resolve),
          children: routers
        },
        {
          path: '/login',
          component: resolve => require(['./views/login.vue'], resolve)
        }
      ]
    });
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    });

  }
});
