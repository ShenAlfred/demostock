<template>
  <div class="full-page">
    <!--  Drawer -->
    <drawer :show.sync="drawerVisibility" :drawer-style="{'background-color':'#e85d5d', width: '300px'}">
      <!-- top-banner -->
      <div class="top-banner">
        <img :src="user.avatar" alt="" class="avatar">
        <div class="user-name">{{user.name || 'Alfred' }}</div>
        <div class="expand" v-on:click="drawerVisibility = true">
          <i class="fa fa-bars fa-2x"></i>
        </div>
      </div>
      <!-- custom sidebar -->
      <div slot="drawer">
        <div class="menu-item">
          <div class="menu-name">菜单</div>
          <div class="menu-child">
            <div class="menu-child-item vux-1px-b"  v-on:click="readAll">
              全部已读
            </div>
            <router-link to="/StockManage" class="menu-child-item vux-1px-b">
              股票管理
              <span class="link-icon">
                <i class="fa fa-chevron-right"></i>
              </span>
            </router-link>
            <div class="menu-child-item vux-1px-b"  v-on:click="refresh">
              刷新
            </div>
          </div>
        </div>
        <div class="menu-item">
          <div class="menu-name">过滤</div>
          <div class="menu-child">
            <div class="menu-child-item vux-1px-b">
              <div class="sc">股票代码</div>
              <div>
                <span class="stock-code ellipsis" v-bind:data-corpId="value.corpId" v-bind:class="{active: value.isActive}" v-for="(value, index) in stocks" v-current-stock="{currentStockCodeIndex: index}">{{value.name}}</span>
              </div>
            </div>
            <div class="menu-child-item vux-1px-b" v-on:click="showCalendarSingle">
              时间
              <span class="link-icon">
                <i class="fa fa-chevron-right"></i>
              </span>
            </div>
            <div class="menu-child-item" v-on:click="showCalendar">
              时间(多选)
              <span class="link-icon">
                <i class="fa fa-chevron-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- custom sidebar  -->
      <div>
        <router-view></router-view>
      </div>
      <!-- list-view -->
      <div class="list-view" id="Home-List-View" ref="HomeListView">
        <div class="group-item vux-1px-b" ref="groupItem" v-bind:data-index="index" v-bind:data-corpId="group.corpId" v-for="(group, index) in groupList">
          <div class="group-item-label vux-1px-b"  v-scrollfixed="{_group: group, _other: groupList, _index: index}">
            <div class="gil-name">{{ group.name }}</div>
            <div class="ac">
              <!--<badge v-if="group.count != 0" :text="group.count"  @click.native="unReadEvent($event, group.corpId)"></badge>-->
              <badge v-if="group.count != 0" :text="group.count"  @click.native="unReadEvent($event, group.corpId)"></badge>
            </div>
          </div>
          <div class="group-ml-panel" style="display: none"> <!-- v-bind:style="{display:group.isToggle}" -->
            <div class="msg-item vux-1px-b" v-bind:class="{importance: msg.type == 1 || msg.type == 2 || msg.type == 3 || msg.type == 4, unimportance: msg.type == 5 || msg.type == 6 || msg.type == 7}" v-for="(msg, index) in group.data.page.list" v-on:click="toDetail(msg.id)">
              <div>
                <div class="msg-text ellipsis">
                  [{{msg.originSource}}]
                  {{ msg.title }}
                </div>
                <div class="msg-date">
                  <span>{{ msg.date }}</span>
                  <span class="msg-type">
                    {{ msg.dateType }}
                  </span>
                </div>
              </div>
              <div class="new-point" v-show="!msg.read"></div>
            </div>
            <divider style="padding:40px 0;" v-show="!group.data.page.list.length">暂无数据</divider>
            <div class="more" v-show="group.data.page.list.length">
              <div v-on:click="more(index, group.corpId)" v-show="!group.data.page.lastPage">点击查看更多</div>
              <div v-show="group.data.page.lastPage">没有更多数据</div>
            </div>
          </div>
        </div>
      </div>
      <!-- list-view -->
    </drawer>
    <popup v-model="isShowCalendarSingle">
      <calendar  :value="calendar1.value" @select="selectDate"></calendar>
    </popup>
    <popup v-model="isShowCalendar">
      <calendar :range="calendar2.range" :lunar="calendar2.lunar" :value="calendar2.value" :begin="calendar2.begin" :end="calendar2.end" @select="selectDateRange"></calendar>
    </popup>
    <toast v-model="getDataError" type="text">获取数据失败!</toast>
  </div>
</template>
<style>
 @import './Home.css';
</style>
<script>
  import { Drawer, Badge, Divider, dateFormat, Popup, Toast } from 'vux';
  import Store from '@/store/index'
  import util from '@/util'
  import config from '@/config';
  import Calendar from 'vue-calendar-master'

  export default{
    data(){
      return {
        currentShowPanel: 0,
        date: [1,2,3,4,5,6,7,8,9,10,11,12],
        calendar1:{
          value:[new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()], //默认日期
        },
        calendar2:{
          range:true,
          value:[[new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()],[new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()]], //默认日期
          // lunar:true, //显示农历
          begin:[1900,1,1], //可选开始日期
          end:[2100,1,1] //可选结束日期
        },
        user: {                     //用户信息
          avatar: '',
          name: ''
        },
        isShowCalendar: false,      //显示日历的开关
        isShowCalendarSingle: false,
        groupList: [],              //股票组
        drawerVisibility: false,    //显示侧边栏的开关
        startRange: '',             //开始日期
        endRange: '',               //结束日期
        lastPage: false,            //是否是最后一页
        stocks: [],                 //股票代码
        corpId: '',                 //股票代码唯一的id
        getDataError: false,        //获取数据失败提示
        group_item_label: []
      }
    },
    methods: {
      what_type_source: function(msg, msg_type, msg_source) {
        switch(msg_type){
          case 1:
            msg.dateType = "公告";
            break;
          case 2:
            msg.dateType = "监管动态";
            break;
          case 3:
            msg.dateType = "监管措施";
            break;
          case 4:
            msg.dateType = "停复牌";
            break;
          case 5:
            msg.dateType = "股吧讨论";
            break;
          case 6:
            msg.dateType = "股吧新闻";
            break;
          case 7:
            msg.dateType = "股吧研报";
            break;
        }
        switch(msg_source) {
          case 1:
            msg.originSource = '上交所';
            break;
          case 2:
            msg.originSource = '深交所';
            break;
          case 3:
            msg.originSource = '港交所';
            break;
          case 4:
            msg.originSource = '新浪';
            break;
          case 5:
            msg.originSource = '东方财富';
            break;
        }
      },
      //获取用户信息
      getUserInfo: function() {
        var self = this;
        this.$ajax.get(config.baseUrl + '/crawler/api/user').then(function(res) {
          self.user.avatar = res.data.data.photoUrl;
          self.user.name = res.data.data.name;
        });
      },
      filterMessageList: function(params, index) {
        var self = this;
        this.$ajax.get(config.baseUrl + '/crawler/api/messages', {
          params: params
        }).then(function(req) {
          if(req.data.code=="0") {
            self.groupList[index].data.page.lastPage = req.data.data.page.lastPage;
            self.groupList[index].data.page.list = req.data.data.page.list;
            self.groupList[index].count = req.data.data.count;
            if(self.groupList[index].data.page.list) {
              self.groupList[index].data.page.list.forEach(function(msg) {
                msg.date = dateFormat(new Date(msg.dateTimestamp), 'YYYY-MM-DD');
                self.what_type_source(msg, msg.type, msg.source);
              });
            }else {
              list.data = {
                page: {
                  firstPage: '',
                  lastPage: '',
                  list: [],
                  orderBy: '',
                  pageNumber: '',
                  pageSize: '',
                  paras: {},
                  totalPage: '',
                  totalRow: ''
                }
              };
            }
            self.$store.state.GroupList[index].data.page.list = req.data.data.page.list;
          }else {
            self.getDataError = true;
          }
        });
      },
      //点击加载更多触发的事件
      requestMessageList: function(params, index) {
        var self = this;
        this.$ajax.get(config.baseUrl + '/crawler/api/messages', {
          params: params
        }).then(function(req) {
          if(req.data.code=="0") {
            self.groupList[index].data.page.lastPage = req.data.data.page.lastPage;
            self.groupList[index].data.page.list = self.groupList[index].data.page.list.concat(req.data.data.page.list);
            self.groupList[index].count = req.data.data.count;
            if(self.groupList[index].data.page.list) {
              self.groupList[index].data.page.list.forEach(function(msg) {
                msg.date = dateFormat(new Date(msg.dateTimestamp), 'YYYY-MM-DD');
                self.what_type_source(msg, msg.type, msg.source);
              });
            }else {
              list.data = {
                page: {
                  firstPage: '',
                  lastPage: '',
                  list: [],
                  orderBy: '',
                  pageNumber: '',
                  pageSize: '',
                  paras: {},
                  totalPage: '',
                  totalRow: ''
                }
              };
            }
            self.$store.state.GroupList[index].data.page.list = self.groupList[index].data.page.list;
          }else {
            self.getDataError = true;
          }
        });
      },
      //获取消息列表
      getMessageList: function(params,index) {
        var self = this;
        if(this.$store.state.GroupList[index].data.page.list.length) {
          this.$ajax.get(config.baseUrl + '/crawler/api/messages', {
            params: params
          }).then(function(req) {
            if(req.data.code=="0") {
              self.$store.state.GroupList[index].count = req.data.data.count;
              self.groupList[index].data.page.list = self.$store.state.GroupList[index].data.page.list;
              self.groupList[index].count = self.$store.state.GroupList[index].count;
            }
          });
        }else {
          this.$ajax.get(config.baseUrl + '/crawler/api/messages', {
            params: params
          }).then(function(req) {
            if(req.data.code=="0") {
              self.groupList[index].data.page.lastPage = req.data.data.page.lastPage;
              self.groupList[index].data.page.list = self.groupList[index].data.page.list.concat(req.data.data.page.list);
              if(self.groupList[index].data.page.list) {
                self.groupList[index].data.page.list.forEach(function(msg) {
                  msg.date = dateFormat(new Date(msg.dateTimestamp), 'YYYY-MM-DD');
                  self.what_type_source(msg, msg.type, msg.source);
                });
              }else {
                list.data = {
                  page: {
                    firstPage: '',
                    lastPage: '',
                    list: [],
                    orderBy: '',
                    pageNumber: '',
                    pageSize: '',
                    paras: {},
                    totalPage: '',
                    totalRow: ''
                  }
                };
              }
            }else {
              self.getDataError = true;
            }
          });
        }
      },
      //获取组列表
      getGroupList: function(params) {
        var self = this;
        if(this.$store.state.GroupList.length) {
          self.groupList = this.$store.state.GroupList;
        }else {
          this.$ajax.get(config.baseUrl + "/crawler/api/statisticStocks", {
            params: params
          }).then(function(req) {
            if(req.data.code == "0") {
              self.groupList = req.data.data.list;
              self.corpId = self.groupList[0].corpId;
              self.groupList.forEach(function(list, index) {
//                index == 0 ? list.isToggle = 'block' : list.isToggle = 'none';
                list.pageNumber = 1;
                if(list.data) {
                  list.data.page.list.forEach(function(msg) {
                    msg.date = dateFormat(new Date(msg.dateTimestamp), 'YYYY-MM-DD');
                    self.what_type_source(msg, msg.type, msg.source);
                  });
                }else {
                  list.data= {
                    page: {
                      firstPage: '',
                      lastPage: '',
                      list: [],
                      orderBy: '',
                      pageNumber: '',
                      pageSize: '',
                      paras: {},
                      totalPage: '',
                      totalRow: ''
                    }
                  }
                }
              });
              self.$store.state.GroupList = self.groupList;
            }else {
              self.getDataError = true;
            }
          });
        }
      },
      //获取股票代码列表
      getStocksList: function() {
        var self = this;
        this.$ajax.get(config.baseUrl + '/crawler/api/stocks').then(function(res) {
          self.stocks = res.data.data;
          self.stocks.forEach(function(every) {
            every.isActive = false;
          })
        });
      },
      //刷新
      refresh: function() {
        location.reload();
      },
      //点击全部阅读事件
      readAll: function() {
        var self = this;
        this.drawerVisibility = false;
        this.$ajax.get(config.baseUrl + '/crawler/api/readall', {
          params: {
            id: 0
          }
        }).then(function(req) {
          if(self.$store.state.GroupList.length) {
            self.$store.state.GroupList.forEach(function(group) {
              group.count = 0;
              if(group.data.page.list.length) {
                group.data.page.list.forEach(function(item) {
                  item.read = 1;
                });
              }
            });
          }else {
            self.groupList.forEach(function(group) {
              group.count = 0;
              if(group.data.page.list.length) {
                group.data.page.list.forEach(function(e) {
                  e.read = 1;
                })
              }
            });
          }
        });
      },
      //组未读事件
      unReadEvent: function(e,corpId) {
        e.stopPropagation();
        var _corpId = corpId;
        this.$store.state.GroupList.forEach(function(group) {
          if(_corpId == group.corpId) {
            group.count = 0;
            if(group.data.page.list.length > 0) {
              group.data.page.list.forEach(function(msg) {
                msg.read = 1;
              });
            }
          }
        });
      },
      //点击加载更多
      more: function(index, corpId) {
        this.requestMessageList({
          "paras[corpId]": corpId,
          pageNumber: ++this.groupList[index].pageNumber
        }, index);
      },
      //选择时间范围
      selectDateRange: function(start, end) {
        this.startRange = start[0]+"-"+this.date[start[1]]+"-"+start[2];
        this.endRange = end[0]+"-"+this.date[end[1]]+"-"+end[2];
        this.isShowCalendar = false;
        this.filterMessageList({
          "paras[startTime]": this.startRange,
          "paras[endTime]": this.endRange,
          "paras[corpId]": this.corpId,
          pageNumber: 1
        },this.currentShowPanel);
      },
      //选择时间
      selectDate: function(value) {
        this.startRange = value[0]+"-"+value[1]+"-"+value[2];
        this.isShowCalendarSingle = false;
        this.filterMessageList({
          "paras[startTime]": this.startRange,
          "paras[corpId]": this.corpId,
          pageNumber: 1
        },this.currentShowPanel);
      },
      //跳转详情页面
      toDetail: function(id) {
        this.$router.push({ name: 'ArticleDetail', params: { articleId: id } });
      },
      //显示日历关闭侧边栏
      showCalendar: function(e) {
        this.drawerVisibility = false;
        this.isShowCalendar = true;
      },
      showCalendarSingle: function() {
        this.drawerVisibility = false;
        this.isShowCalendarSingle = true;
      }
    },
    mounted: function() {
      var self = this;
      this.getUserInfo();
      this.getGroupList();
      this.getStocksList();
      this.$refs.HomeListView.addEventListener('scroll', function() {
        self.$store.state.scrollTop = this.scrollTop;
      });
      this.$nextTick(()=> {
        this.$refs.HomeListView.scrollTop = self.$store.state.scrollTop;
//        var groupPanels = document.querySelectorAll(".group-ml-panel");
//        groupPanels.forEach(function(each) {
//          each.style.display = 'none';
//        });
//        groupPanels[this.$store.state.currentShowPanel].style.display = 'block';
      });
    },
    directives: {
      scrollfixed: {
        inserted: function(el, binding, vnode) {
          el.addEventListener('click', function(event) {
            event.stopPropagation();
            vnode.context.corpId = binding.value._group.corpId;
            vnode.context.currentShowPanel =  binding.value._index;
            vnode.context.$store.state.currentShowPanel = binding.value._index;
            if(document.querySelector("#Home-List-View").scrollTop > 0 ){
              document.querySelector("#Home-List-View").scrollTop = binding.value._index * 48;
            }
            if(el.nextElementSibling.style.display == 'block') {
              el.nextElementSibling.style.display = 'none';
            }else {
              var groupItem = document.querySelectorAll(".group-item-label");
//              groupItem.forEach(function(each) {
//                each.nextElementSibling.style.display = 'none';
//              });
              el.nextElementSibling.style.display = 'block';
              vnode.context.getMessageList({
                "paras[corpId]": binding.value._group.corpId
              }, binding.value._index);
            }
          })
        }
      },
      currentStock: {
        inserted: function(el, binding, vnode) {
          var obj= {};
          el.addEventListener('click', function() {
            var groupItem = document.querySelectorAll('.group-item');
            var corpId = el.dataset.corpid;
            vnode.context.corpId = corpId;
            groupItem.forEach(function(el, index) {
              el.querySelector('.group-ml-panel').style.display = 'none';
              if(corpId == el.dataset.corpid) {
                obj = {
                  currentBlockIndex: index,
                  _index: parseInt(el.dataset.index)
                }
                el.querySelector('.group-ml-panel').style.display = 'block';
                return obj;
              }
            });
            vnode.context.stocks.forEach(function(every) {
              every.isActive = false;
            });
            vnode.context.stocks[binding.value.currentStockCodeIndex].isActive = true;
            document.querySelector("#Home-List-View").scrollTop = obj.currentBlockIndex * 48;
            vnode.context.drawerVisibility = false;
            vnode.context.currentShowPanel = obj._index;
            vnode.context.$store.state.currentShowPanel = obj._index;
            vnode.context.getMessageList({
              "paras[corpId]": corpId
            }, obj._index);
          });
        }
      }
    },
    components: {
      Drawer,
      Badge,
      Divider,
      Calendar,
      Popup,
      Toast
    }
  }
</script>
