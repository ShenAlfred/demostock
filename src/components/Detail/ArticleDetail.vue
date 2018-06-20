<template>
  <div>
    <div class="fixed">
      <x-header :title="title" :left-options="{preventGoBack:true, backText:'首页'}" @on-click-back="backHome"></x-header>
    </div>
    <div class="article-panel" v-if="!isShowDefault">
      <h3 class="article-title" v-html="title"></h3>
      <div class="article-time">{{date}}</div>
      <div class="article-time">获取时间: {{ getDate }}</div>
      <div class="article-content sina_content">
          <div v-html="content"></div>
      </div>
      <div class="attachment-text" v-if="attachment">
        <a v-bind:href="attachment">
          <i class="fa fa-file"></i>
          <span>附件下载</span>
        </a>
      </div>
      <div class="attachment-text" v-if="sourceLink">
        <a v-bind:href="sourceLink" style="text-decoration: underline">原文链接</a>
      </div>
    </div>
    <div class="default-content" v-show="isShowDefault">
      <img src="~images/no_article.png" />
      <div>暂无内容</div>
    </div>
  </div>
</template>
<style>
  @import './Detail.css';
</style>
<script>
  import { XHeader, dateFormat } from 'vux';
  import config from '@/config';

  export default{
    data(){
      return {
        title: "",
        date: '',
        getDate: '',
        content: '',
        attachment: '',
        sourceLink: '',
        isShowDefault: false
      }
    },
    methods: {
      backHome: function() {
        //不同点
       this.$router.push({ name: 'Home'});
      }
    },
    mounted: function() {
      var articleId = this.$route.params.articleId, self = this;
      this.$store.state.GroupList.forEach(function(group) {
        if(group.data.page.list.length) {
          group.data.page.list.forEach(function(item, index) {
            if(item.id == articleId) {
              if(item.read == 1) {
                return
              }else {
                item.read = 1;
                if(group.count==0) return
                else {
                  group.count = group.count - 1;
                }
              }
            }
          });
        }
      });
      this.$ajax.get(config.baseUrl + '/crawler/api/msg_detail', {
        params: {
          id: articleId
        }
      }).then(function(req) {
        if(req.data.code == "0") {
          self.title = req.data.data.title;
          self.date = req.data.data.dateTimeStr;
          self.getDate = req.data.data.createTimeStr;
          self.content = req.data.data.content;
          req.data.data.attachment ? self.attachment = config.baseUrl + req.data.data.attachment : self.attachment = "";
          req.data.data.sourceLink ? self.sourceLink = req.data.data.sourceLink : self.sourceLink = '';
        }else {
          self.isShowDefault = true;
        }
      });
    },
    components: {
      XHeader
    }
  }
</script>
