<template>
  <div class="ordersettle">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="bg">
      <div class="select-address">
        <div v-if="currentContact.addressDetail.length <= 0">
          <span class="tips">没有可选地址，请新增地址！</span>
          <van-contact-card
            class="t"
            type="add"
            add-text="添加地址"
            @click="onAdd"
          />
        </div>
        <div v-else>
          <div class="select" @click="show = !show">选择地址 &gt;</div>
          <div class="address">
            <span>{{ currentContact.name }}</span
            ><span>{{ currentContact.tel }}</span>
            <span v-if="currentContact.isDefault">默认</span>
            <div>
              {{
                "" +
                currentContact.province +
                currentContact.city +
                currentContact.county +
                currentContact.addressDetail
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order">
      <div class="title">订单信息</div>
      <van-card
        class="list"
        v-for="(v, i) in data"
        :key="i"
        :num="v.count"
        :price="v.price"
        :desc="v.enname"
        :title="v.name"
        :thumb="v.small_img"
        ><template #tags>
          <van-tag plain type="danger">{{ v.rule }}</van-tag>
        </template></van-card
      >
    </div>
    <div class="sum">
      <div>{{ time | delTime }}</div>
      <div class="candm">
        <div class="c">共计{{ count }}件</div>
        <div class="m">
          合计 <span>￥{{ money }}</span>
        </div>
      </div>
    </div>
    <van-button type="primary" @click="settleNow" block>立即结算</van-button>
    <!-- 弹出层 -->
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '40%' }"
      closeable
    >
      <div class="title-name">选择地址</div>
      <van-radio-group class="over" v-model="radio">
        <div class="li" v-for="(v, i) in address" :key="i">
          <div class="address">
            <span>{{ v.name }}</span
            ><span>{{ v.tel }}</span>
            <span v-if="v.isDefault">默认</span>
            <div>
              {{ "" + v.province + v.city + v.county + v.addressDetail }}
            </div>
          </div>
          <div class="selected">
            <van-radio :name="i"></van-radio>
          </div>
        </div>
      </van-radio-group>
      <van-button type="primary" block class="new-address" @click="onAdd"
        >新增地址</van-button
      >
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      show: false, //弹出层
      address: [],
      data: [],
      time: "",
      radio: -1,
    };
  },
  computed: {
    //计算数量
    count() {
      let count = 0;
      this.data.forEach((v) => {
        count += v.count;
      });
      return count;
    },
    //计算价格
    money() {
      let sum = 0;
      this.data.forEach((v) => {
        sum += v.price * v.count;
      });
      return sum.toFixed(2);
    },
    //地址选取
    currentContact() {
      if (this.radio == -1) {
        return {
          addressDetail: "",
          aid: "",
          areaCode: "",
          city: "",
          county: "",
          createdAt: "",
          id: "",
          isDefault: "",
          isRemove: "",
          name: "",
          postalCode: "",
          province: "",
          tel: "",
          updatedAt: "",
          userId: "",
        };
      }
      return this.address[this.radio];
    },
  },
  methods: {
    //返回
    onClickLeft() {
      this.$router.back();
    },
    //新增
    onAdd() {
      this.$router.push("/addaddress");
    },
    //立即结算
    settleNow() {
      if (this.currentContact.addressDetail.length <= 0) {
        Toast("请选择地址再提交");
        return;
      }
      //传过来的订单
      let arr = [];
      if (Array.isArray(this.$route.query.arr)) {
        arr = this.$route.query.arr;
      } else {
        arr.push(this.$route.query.arr);
      }
      this.axios({
        url: "/pay",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          sids: JSON.stringify(arr),
          phone: this.currentContact.tel,
          address: this.currentContact.addressDetail,
          receiver: this.currentContact.name,
        },
      })
        .then((res) => {
          Toast(res.data.msg + "这里跳过了付款阶段");
          this.$router.push("/myorder");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  filters: {
    delTime(v) {
      if (v.length <= 0) return;
      let year = v.getFullYear();
      let month = v.getMonth() + 1;
      let day = v.getDate();
      let hour = v.getHours();
      let minute = v.getMinutes();
      let second = v.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //计算当前时间
      let date = new Date();
      vm.time = date;
      //传过来的订单
      let arr = [];
      if (Array.isArray(vm.$route.query.arr)) {
        arr = vm.$route.query.arr;
      } else {
        arr.push(vm.$route.query.arr);
      }
      //查看订单提交插口
      vm.axios({
        url: "/commitShopcart",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
          sids: JSON.stringify(arr),
        },
      })
        .then((res) => {
          vm.data = res.data.result;
        })
        .catch((e) => {
          console.log(e);
        });
      //查询地址
      vm.axios({
        url: "/findAddress",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          vm.address = res.data.result;
          res.data.result.forEach((v, i) => {
            if (v.isDefault == 1) {
              vm.radio = i;
            }
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
.ordersettle {
  padding-bottom: 60px;
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  /deep/.van-nav-bar__text {
    color: rgb(4, 161, 106);
  }
  /deep/.van-nav-bar .van-icon {
    color: rgb(4, 161, 106);
  }
  .bg {
    height: 140px;
    background-color: rgb(4, 161, 106);
    position: relative;
    .select-address {
      position: absolute;
      height: 120px;
      width: 94%;
      top: 40px;
      left: 3%;
      background-color: #fff;
      border-radius: 10px;
      .tips {
        position: absolute;
        top: 10px;
        left: 10px;
        color: #aaa;
      }
      .t {
        margin-top: 30px;
      }
      .select {
        height: 30px;
        line-height: 30px;
        text-indent: 15px;
        font-size: 14px;
      }
      .address {
        padding: 15px;
        span {
          padding: 0px 10px 0 0px;
          &:nth-child(1) {
            font-size: 16px;
            color: rgb(4, 161, 106);
            font-weight: bold;
          }
          &:nth-child(3) {
            background-color: rgb(4, 161, 106);
            color: #fff;
            padding: 5px 10px;
            border-radius: 20px;
          }
        }
        div {
          margin-top: 5px;
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
  .order {
    background: #fff;
    width: 94%;
    padding: 15px;
    margin: 30px auto 0;
    box-sizing: border-box;
    border-radius: 10px;
    .title {
      margin-bottom: 10px;
    }
    .list {
      .van-card__price {
        color: rgb(4, 161, 106);
        font-weight: bold;
      }
      .van-tag--danger.van-tag--plain {
        color: rgb(4, 161, 106);
      }
    }
  }
  .sum {
    background: #fff;
    width: 94%;
    padding: 15px;
    margin: 10px auto 0;
    box-sizing: border-box;
    border-radius: 10px;
    .candm {
      margin-top: 10px;
      display: flex;
      .c {
        flex: auto;
      }
      .m {
        font-weight: bold;
        color: rgb(4, 161, 106);
        font-size: 14px;
        flex: auto;
        text-align: right;
      }
    }
  }
  .van-button--primary {
    position: fixed;
    bottom: 0;
    background-color: rgb(4, 161, 106);
  }
  .van-popup {
    padding: 15px;
    .title-name {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .over {
      height: 65%;
      overflow: auto;
    }
    /deep/.new-address {
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .li {
      display: flex;
      border: 1px solid #eee;
      margin-top: 10px;
      border-radius: 10px;
      padding: 15px;
      .address {
        flex: auto;
        span {
          padding: 0px 10px 0 0px;
          &:nth-child(1) {
            font-size: 16px;
            color: rgb(4, 161, 106);
            font-weight: bold;
          }
          &:nth-child(3) {
            background-color: rgb(4, 161, 106);
            color: #fff;
            padding: 5px 10px;
            border-radius: 20px;
          }
        }
        div {
          margin-top: 5px;
          font-size: 14px;
          color: #999;
        }
      }
      .selected {
        width: 40px;
        // background-color: #000;
        /deep/.van-radio__icon--checked .van-icon {
          background-color: rgb(4, 161, 106);
          border-color: rgb(4, 161, 106);
        }
      }
    }
  }
}
</style>