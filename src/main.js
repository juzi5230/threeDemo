import Vue from 'vue'
import App from './App.vue'
import tween from "./assets/js/tween";
Vue.use(tween);
// import tween from "./plugins/tween";
// Vue.use(tween);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
