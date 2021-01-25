<template>
  <div class="index">
    <router-view @changeNum="changeNum" />
    <van-tabbar v-model="active" route>
      <van-tabbar-item name="home" icon="wap-home" replace to="/"
        >首页</van-tabbar-item
      >
      <van-tabbar-item name="meaue" icon="gift" replace to="/menu"
        >菜单</van-tabbar-item
      >
      <van-tabbar-item
        replace
        to="/shopcart"
        name="shopcart"
        icon="shopping-cart"
        :badge="count > 0 ? count : ''"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item name="mine" icon="manager" replace to="/mine"
        >我的</van-tabbar-item
      >
    </van-tabbar>
    <!-- 底部占位 -->
    <div class="footer"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: "home",
      count: 0,
    };
  },
  methods: {
    go(path) {
      this.$router.push(path);
    },
    changeNum(num) {
      //改变数值
      this.count = num;
    },
  },
  beforeRouteEnter(to, from, next) {
    //购物车数量
    next((vm) => {
      vm.axios({
        url: "/shopcartCount",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          vm.count = res.data.result;
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less" scoped>
.index {
  .van-tabbar-item--active {
    color: rgb(4, 161, 106);
  }
  .footer {
    height: 50px;
  }
}
</style>