import Vue from 'vue'
import App from './App.vue'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

Vue.use(Donut);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
