<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import 'assets/style/common.css';
  @import '~vux/src/styles/1px.less';
  @import 'assets/FontAwesome-4.7.0/css/font-awesome.min.css';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    background: #fff;
    height: 100%;
    -webkit-overflow-scrolling : touch;
  }
  .full-page {
    width: 100%;
    height: 100%;
  }
  .more {
    padding: 15px;
    color: #ccc;
    font-size: 14px;
    text-align: center;
  }
</style>
