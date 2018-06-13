<template>
  <div>
    <x-header title="股票管理" :right-options="{showMore: true}" @on-click-more="showMenus = true"></x-header>
    <div class="stocks-grid">
      <grid :cols="3">
        <grid-item class="stock-grid-item" v-for="(value, index) in stocks" :key="value.id">
          <div>{{value.name}}</div>
          <div>{{value.code}}</div>
          <div class="un-del" v-if="value.fixed==1" v-show="isShowDelete">锁定</div>
          <a href="javascript:;" class="close-icon" v-if="value.fixed==0" v-show="isShowDelete" v-on:click="delete_stock(value.id,index)">删除</a>
        </grid-item>
      </grid>
    </div>
    <actionsheet :menus="menus" v-model="showMenus" show-cancel @on-click-menu="click_menu" @on-click-menu-cancel="menu_cancel"></actionsheet>
    <popup v-model="showAddPopup" height="100%">
      <div class="full-page" style="background: #fff;">
        <group style="margin-top:-20px; padding: 0 15px">
          <x-input title="股票代码" type="number" v-model="stock_code" @on-change="check_stock"></x-input>
          <div class="stock-list">
            <div class="stock" v-for="(value, index) in search_stocks" v-on:click="select_stock(value.code, value.corpId)">
              {{value.name}} ({{value.code}})
            </div>
          </div>
          <x-textarea title="备注" v-model="stock_remark"></x-textarea>
          <flexbox>
            <flexbox-item>
              <x-button text="添加" plain type="warn" class="complete-btn" @click.native="add_stock"></x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button text="取消" plain class="complete-btn" @click.native="showAddPopup = false"></x-button>
            </flexbox-item>
          </flexbox>
        </group>
      </div>
    </popup>
    <toast v-model="toast.isShowToast" position="bottom" type="text">{{toast.text}}</toast>
  </div>
</template>
<style>
  @import './Manage.css';
</style>
<script>
  import { XHeader, Actionsheet, Grid, GridItem, Popup, Group, XInput, XTextarea, XButton, Toast, Flexbox, FlexboxItem, dateFormat } from 'vux';
  import config from '@/config';

  export default{
    data(){
      return {
        toast: {
          isShowToast: false,
          text: ''
        },
        stock_code: null,
        stock_remark: '',
        corpId: '',
        search_stocks: [],
        stocks: [],
        showAddPopup: false,
        showMenus: false,
        isShowDelete: false,
        menus: ['添加', '删除'],
        showStockList: false
      }
    },
    mounted: function() {
      this.getStocks();
    },
    methods: {
      getStocks: function() {
        var self = this;
        this.$ajax.get(config.baseUrl + '/crawler/api/stocks').then(function(res) {
          self.stocks = res.data.data;
        });
      },
      click_menu: function(menuKey, menuItem) {
        if(menuKey == 0) {
          //执行添加操作
          this.showMenus = false;
          this.showAddPopup = true;
        }
        if(menuKey ==1) {
          //执行删除操作
          this.isShowDelete = true;
        }
      },
      delete_stock: function(id, index) {
        var self = this;
        this.$ajax.get(config.baseUrl+'/crawler/api/del',{
          params: {
            id: id
          }
        }).then(function(res) {
          self.stocks.splice(index,1);
        });
      },
      check_stock: function(arg) {
        var self = this;
        this.corpId = "";
        if(arg == null) {return;}
        this.$ajax.post(config.baseUrl + '/crawler/api/codematch', {
          code: arg
        }).then(function(res) {
          self.search_stocks = res.data.data;
          if(res.data.data.length == 1) {
            self.corpId = res.data.data[0].corpId;
          }
        });
      },
      select_stock: function(code, corpId) {
        this.stock_code = code;
        this.corpId = corpId;
      },
      add_stock: function() {
        var self = this;
        if(!this.corpId) {
          self.toast.text = "请输入有效的股票代码";
          self.toast.isShowToast = true;
          return;
        }
        else {
          this.$ajax.post(config.baseUrl + '/crawler/api/add', {
            corpId: this.corpId,
            remark: this.stock_remark
          }).then(function(res) {
            self.stock_code = null;
            self.stock_remark = '';
            self.showAddPopup = false;
            self.search_stocks = [];
            self.toast.text = res.data.msg;
            self.toast.isShowToast = true;
            self.getStocks();
          });
        }
      },
      menu_cancel: function() {
        this.isShowDelete = false;
      }
    },
    components: {
      XHeader,
      Actionsheet,
      Grid,
      GridItem,
      Popup,
      Group,
      XInput,
      XTextarea,
      XButton,
      Toast,
      Flexbox,
      FlexboxItem
    }
  }
</script>
