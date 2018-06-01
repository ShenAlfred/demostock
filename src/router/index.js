import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store/index'
import Config from '@/config'

Vue.use(Router)

const router = new Router({
  mode: Config.isDevEnv ? 'history' : 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        recodeScroll: true
      },
      component: resolve => require(['@/components/Home/Home'], resolve),
      beforeEnter: function(to, from , next) {
        if(typeof(applyId) == "undefined" || applyId == ""){
          next();
        }else {
          if(applyId) {
            next({name: 'ArticleDetailOther', params: {articleId: applyId}});
          }else {
            next();
          }
        }
        if(from.name == 'StockManage') {
          next();
          location.reload();
        }
      }
    },
    {
      path: '/StockManage',
      name: 'StockManage',
      component: resolve => require(['@/components/Manage/StockManage'], resolve)
    },
    {
      path: '/ArticleDetail/:articleId',
      name: 'ArticleDetail',
      component: resolve => require(['@/components/Detail/ArticleDetail'], resolve)
    },
    {
      path: '/ArticleDetailOther/:articleId',
      name: 'ArticleDetailOther',
      component: resolve => require(['@/components/Detail/ArticleDetailOther'], resolve)
    }
  ]
})

router.beforeEach(function(to, from, next) {
  if(from.meta.recodeScroll) {
    var scrollTop = document.querySelector("#"+ from.name +"-List-View").scrollTop;
    //console.log(document.querySelector("#"+ from.name +"-List-View"))
    Store.state.scrollElements[from.name] = scrollTop;
  }
  console.log(Store);
  next();
})

export default router;


