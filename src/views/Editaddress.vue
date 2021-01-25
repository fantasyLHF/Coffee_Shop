<template>
  <div class="editaddress">
    <van-nav-bar
      title="编辑地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-address-edit
      :address-info="info"
      :area-list="areaList"
      show-postal
      show-delete
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
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
      info: {},
    };
  },
  props: ["id"],
  methods: {
    onClickLeft() {
      this.$router.back();
      Toast("返回");
    },
    // 保存地址
    onSave(content) {
      Toast("save");
      this.axios({
        method: "POST",
        url: "/editAddress",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          aid: this.id,
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
    onDelete() {
      Toast("delete");
      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          aid: this.id,
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
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios({
        url: "/findAddressByAid",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
          aid: vm.id,
        },
      })
        .then((res) => {
          res.data.result[0].isDefault == 0
            ? (res.data.result[0].isDefault = false)
            : (res.data.result[0].isDefault = true);
          vm.info = { ...res.data.result[0] };
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less" scoped>
.editaddress {
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  /deep/.van-nav-bar__text {
    color: rgb(4, 161, 106);
  }
  /deep/.van-nav-bar .van-icon {
    color: rgb(4, 161, 106);
  }
  /deep/.van-button--danger {
    background-color: rgb(4, 161, 106);
    border-color: rgb(4, 161, 106);
  }
}
</style>