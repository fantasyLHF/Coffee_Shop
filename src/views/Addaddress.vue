<template>
  <div class="add-address">
    <van-nav-bar
      title="新增地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-address-edit
      class="form"
      :area-list="areaList"
      show-postal
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
    />
  </div>
</template>
<script>
import area from "../assets/js/area";
import { Toast } from "vant";
export default {
  data() {
    return {
      areaList: area,
      searchResult: [],
    };
  },
  methods: {
    //返回
    onClickLeft() {
      this.$router.back();
    },
    // 保存地址
    onSave(content) {
      Toast("save");
      this.axios({
        method: "POST",
        url: "/addAddress",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          name: content.name,
          tel: content.tel,
          province: content.province,
          city: content.city,
          county: content.county,
          addressDetail: content.addressDetail,
          areaCode: content.areaCode,
          postalCode: content.postalCode,
          isDefault: content.isDefault ? 1 : 0,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
          this.$router.back();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // onChangeDetail(val) {
    //   if (val) {
    //     this.searchResult = [
    //       {
    //         name: "黄龙万科中心",
    //         address: "杭州市西湖区",
    //       },
    //     ];
    //   } else {
    //     this.searchResult = [];
    //   }
    // },
  },
};
</script>
<style lang="less" scoped>
.add-address {
  /deep/.van-nav-bar__text {
    color: rgb(4, 161, 106);
  }
  /deep/.van-nav-bar .van-icon {
    color: rgb(4, 161, 106);
  }
  .form {
    /deep/.van-button--danger {
      background-color: rgb(4, 161, 106);
      border-color: rgb(4, 161, 106);
    }
  }
}
</style>