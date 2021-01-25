<template>
  <div class="menu">
    <!-- 搜索 -->
    <van-search
      v-model="value"
      shape="round"
      background="#fff"
      placeholder="输入商品名称"
      @keyup="search"
    />
    <!-- 搜索控制 -->
    <div v-if="flag">
      <!-- 类型选择 -->
      <van-tabbar v-model="active">
        <van-tabbar-item name="home" @click="changedata('hotdata')"
          ><span>推荐</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.active1 : icon.inactive1"
            /> </template
        ></van-tabbar-item>
        <van-tabbar-item name="search" @click="changedata('latte')"
          ><span>拿铁</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.active2 : icon.inactive2"
            /> </template
        ></van-tabbar-item>
        <van-tabbar-item name="friends" @click="changedata('coffee')"
          ><span>咖啡</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.active3 : icon.inactive3"
            /> </template
        ></van-tabbar-item>
        <van-tabbar-item name="setting" @click="changedata('rena_ice')"
          ><span>瑞纳冰</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.active4 : icon.inactive4"
            /> </template
        ></van-tabbar-item>
      </van-tabbar>
      <!-- 商品数据 -->
      <van-card
        @click="go(v.pid)"
        v-for="v in showdata"
        :key="v.id"
        :tag="v.type"
        :price="v.price"
        :desc="v.desc"
        :title="v.name"
        :thumb="v.smallImg"
      />
    </div>
    <div v-else>
      <div class="tips" v-show="searchdata.length == 0">未找到相关商品！</div>
      <van-card
        @click="go(v.pid)"
        v-for="v in searchdata"
        :key="v.id"
        :tag="v.type"
        :price="v.price"
        :desc="v.desc"
        :title="v.name"
        :thumb="v.smallImg"
      />
    </div>
  </div>
</template>
<script>
import "../assets/less/menu.less";
export default {
  data() {
    return {
      timer: null, //防抖
      value: "", //搜索
      flag: true, //搜索控制
      active: "home", //图标类型选择
      icon: {
        //图标类型选择
        active1: require("../assets/img/奶茶1.png"),
        active2: require("../assets/img/拿铁1.png"),
        active3: require("../assets/img/咖啡1.png"),
        active4: require("../assets/img/冰淇淋1.png"),
        inactive1: require("../assets/img/奶茶.png"),
        inactive2: require("../assets/img/拿铁.png"),
        inactive3: require("../assets/img/咖啡.png"),
        inactive4: require("../assets/img/冰淇淋.png"),
      },
      showdata: [], //用于展示的数据
      hotdata: [], //热门数据
      coffee: [], //咖啡数据
      latte: [], //拿铁数据
      rena_ice: [], //瑞纳冰数据
      searchdata: [], //搜索结果
    };
  },
  methods: {
    search() {
      // 防抖
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 输入内容存在
        if (this.value.length > 0) {
          this.flag = false;
          this.axios({
            url: "/search",
            method: "GET",
            params: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              name: this.value,
            },
          })
            .then((res) => {
              this.searchdata = res.data.result;
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          this.flag = true;
        }
      }, 400);
    },
    getdata(type) {
      //根据类型获取数据
      //获取拿铁数据
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          key: "type",
          value: type,
        },
      })
        .then((res) => {
          if (res.data.result) {
            this[type] = res.data.result;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    changedata(key) {
      //改变数据
      this.showdata = this[key];
    },
    go(id) {
      //跳到详情页面
      this.$router.push("/detail/" + id);
    },
  },
  created() {
    this.getdata("coffee");
    this.getdata("latte");
    this.getdata("rena_ice");
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios("/typeProducts?key=isHot&value=1&" + vm.$store.state.appkey)
        .then((data) => {
          if (data.data.result) {
            vm.hotdata = data.data.result;
            vm.showdata = vm.hotdata;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
