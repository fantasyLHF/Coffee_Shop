<template>
  <div class="addr">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="bg"></div>
    <section>
      <div class="box">
        <div v-if="list.length == 0" class="tips">
          还没提交收货地址哦！<br />
          请点击新增地址进行地址添加...
        </div>
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="onAdd"
          @edit="onEdit"
          :switchable="false"
        />
      </div>
    </section>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      chosenAddressId: "1",
      list: [],
    };
  },
  methods: {
    onAdd() {
      this.$router.push("/addaddress");
    },
    onEdit(item, index) {
      Toast("编辑地址:" + index);
      this.$router.push("/editaddress/" + item.id);
    },
    onClickLeft() {
      //返回
      this.$router.back();
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios({
        url: "/findAddress",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          res.data.result.forEach((v) => {
            let obj = {
              id: v.aid,
              name: v.name,
              tel: v.tel,
              address: "" + v.province + v.city + v.county + v.addressDetail,
              isDefault: v.isDefault,
            };
            vm.list.push(obj);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less" scoped>
.addr {
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  /deep/.van-nav-bar__text {
    color: rgb(4, 161, 106);
  }
  /deep/.van-nav-bar .van-icon {
    color: rgb(4, 161, 106);
  }
  .bg {
    height: 100px;
    background-color: rgb(4, 161, 106);
  }
  section {
    .box {
      font-size: 14px;
      border-radius: 10px;
      position: relative;
      background-color: #fff;
      width: 94%;
      left: 3%;
      top: -20px;
      // padding: 15px 10px 0;
      box-sizing: border-box;
      .tips {
        color: rgb(4, 161, 106);
        text-align: center;
        font-weight: bold;
        margin-top: 20px;
      }
      .van-address-list__bottom {
        background-color: #eee;
      }
      .van-button--danger {
        background-color: rgb(4, 161, 106);
        border-color: rgb(4, 161, 106);
      }
    }
  }
}
</style>