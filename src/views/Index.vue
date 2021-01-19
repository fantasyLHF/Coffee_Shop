<template>
  <div class="index">
    <router-view />
    <van-tabbar v-model="active">
      <van-tabbar-item name="home" icon="wap-home" @click="go('/')"
        >首页</van-tabbar-item
      >
      <van-tabbar-item name="meaue" icon="gift" @click="go('/menu')"
        >菜单</van-tabbar-item
      >
      <van-tabbar-item
        name="shopcart"
        icon="shopping-cart"
        @click="go('/shopcart')"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item name="mine" icon="manager" @click="go('/mine')"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from "vant";
export default {
  data() {
    return {
      active: "home",
    };
  },
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  methods: {
    go(path) {
      this.$router.push(path);
    },
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
};
</script>
<style lang="less" scoped>
.index {
  .van-tabbar-item--active {
    color: rgb(4, 161, 106);
  }
}
</style>