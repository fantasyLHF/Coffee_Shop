<template>
  <div class="menu">
    <van-search
      v-model="value"
      shape="round"
      background="#fff"
      placeholder="输入商品名称"
      @search="onSearch"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
    };
  },
  methods: {
    onSearch() {
      //搜索
    },
  },
};
</script>
<style lang="less" scoped>
.menu {
  height: 100vh;
  background-color: rgb(247, 247, 247);
  .van-search {
    /deep/.van-icon {
      color: rgb(4, 161, 106);
    }
  }
}
</style>