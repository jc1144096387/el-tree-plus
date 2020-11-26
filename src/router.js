import Vue from "vue";
import Router from "vue-router";
import elTree from "./views/elTree.vue";
import elTreePlus from "./views/elTreePlusDemo.vue";
import virtualListDemo from './views/virtualListDemo/index.vue';
import test from './views/test/index.vue';

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "index",
      redirect: "/el-tree-plus-demo"
    },
    {
      path: "/el-tree",
      name: "elTree",
      component: elTree
    },
    {
      path: "/el-tree-plus-demo",
      name: "elTreePlusDemo",
      component: elTreePlus
    },
    {
      path: "/virtualListDemo",
      name: "virtualListDemo",
      component: virtualListDemo
    },
    {
      path: "/test",
      name: "test",
      component: test
    }
  ]
});
