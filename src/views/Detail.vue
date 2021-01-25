<template>
  <div class="detail">
    <!-- 头部 -->
    <van-nav-bar
      :title="data.name"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 图片 -->
    <img class="img" :src="data.large_img" alt="" />
    <!-- 内容 -->
    <section>
      <div class="content">
        <img :src="data.small_img" alt="" />
        <div class="name">{{ data.name }}</div>
        <div class="enname">{{ data.enname }}</div>
        <div class="price">￥{{ data.price }}</div>
        <div class="temp" v-for="(v, i) in desc" :key="i">
          <div class="n">{{ data[i] }}</div>
          <div class="cont">
            <span
              @click="change(i, si)"
              :class="{ active: active[i] == si }"
              v-for="(sv, si) in v"
              :key="si"
              >{{ sv }}</span
            >
          </div>
        </div>
        <div class="count">
          <div class="num">选择数量</div>
          <div class="step">
            <van-stepper
              v-model="value"
              theme="round"
              button-size="22"
              disable-input
            />
          </div>
        </div>
        <div class="til">商品描述</div>
        <div class="intro" v-for="(v, i) in intro" :key="i">
          {{ i + 1 }}、{{ v }}
        </div>
      </div>
    </section>
    <footer></footer>
    <!-- 底部加入购物车 -->
    <van-goods-action>
      <van-goods-action-icon
        @click="gotoCard"
        icon="cart"
        text="购物车"
        :color="count > 0 ? '#04A16A' : '#999'"
        :badge="count > 0 ? count : ''"
      />
      <van-goods-action-icon
        @click="likeToggle"
        icon="star"
        text="收藏"
        :color="like ? '#04A16A' : '#999'"
      />
      <van-goods-action-button
        color="#27BD88"
        type="warning"
        text="加入购物车"
        @click="puttocart"
      />
      <van-goods-action-button
        color="#04A16A"
        type="danger"
        text="立即购买"
        @click="paynow"
      />
    </van-goods-action>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      data: [],
      desc: {},
      value: 1,
      intro: [],
      active: {},
      like: false,
      count: 0,
    };
  },
  props: ["id"],
  methods: {
    onClickLeft() {
      //返回
      this.$router.back();
    },
    change(i, si) {
      let obj = { ...this.active };
      obj[i] = si;
      this.active = { ...obj };
    },
    likeToggle() {
      // 收藏与取消
      if (this.like) {
        // 取消
        this.axios({
          url: "/notlike",
          method: "POST",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            pid: this.id,
            tokenString: this.$cookies.get("tokenString"),
          },
        })
          .then((res) => {
            console.log(res);
            this.like = false;
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // 收藏
        if (this.$cookies.get("tokenString")) {
          this.axios({
            url: "/like",
            method: "POST",
            data: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              pid: this.id,
              tokenString: this.$cookies.get("tokenString"),
            },
          })
            .then((res) => {
              Toast(res.data.msg);
              this.like = true;
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          Toast("请先登录");
        }
      }
    },
    //加入购物车
    puttocart() {
      let str = "";
      for (let k in this.active) {
        str += "/" + this.desc[k][this.active[k]];
      }
      str = str.slice(1);
      this.axios({
        url: "/addShopcart",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          pid: this.id,
          tokenString: this.$cookies.get("tokenString"),
          count: this.value,
          rule: str,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
          //重新请求购物车数量
          return this.axios({
            url: "/shopcartCount",
            method: "GET",
            params: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              tokenString: this.$cookies.get("tokenString"),
            },
          });
        })
        .then((res) => {
          if (res.data.result > 0) {
            this.count = res.data.result;
          } else {
            this.count = 0;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    gotoCard() {
      this.$router.push("/shopcart");
    },
    // 立即付款
    paynow() {
      // 判断是否登录
      if (this.$cookies.get("tokenString")) {
        // 先加入购物车
        let str = "";
        for (let k in this.active) {
          str += "/" + this.desc[k][this.active[k]];
        }
        str = str.slice(1);
        this.axios({
          url: "/addShopcart",
          method: "POST",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            pid: this.id,
            tokenString: this.$cookies.get("tokenString"),
            count: this.value,
            rule: str,
          },
        })
          .then((res) => {
            this.$router.push({
              path: "/ordersettle",
              query: { arr: [res.data.sid] },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        Toast("请先登录");
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //获取商品详情
      vm.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          pid: vm.id,
        },
      })
        .then((res) => {
          if (res.data.result[0]) {
            vm.data = res.data.result[0];
            let obj = {};
            let arr = ["cream", "milk", "sugar", "tem"];
            arr.forEach((v) => {
              if (res.data.result[0][v].length > 0) {
                obj[v + "_desc"] = res.data.result[0][v].split("/");
                vm.active[v + "_desc"] = 0;
              }
            });
            vm.desc = obj;
            vm.intro = res.data.result[0].desc.split("\n");
          }
        })
        .catch((e) => {
          console.log(e);
        });
      // 判断是否登录
      if (vm.$cookies.get("tokenString") != undefined) {
        // 判断是否收藏
        vm.axios({
          url: "/findlike",
          method: "GET",
          params: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            pid: vm.id,
            tokenString: vm.$cookies.get("tokenString"),
          },
        })
          .then((res) => {
            if (res.data.result) {
              if (res.data.result.length > 0) {
                vm.like = true;
              } else {
                vm.like = false;
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
        //判断购物车数量
        vm.axios({
          url: "/shopcartCount",
          method: "GET",
          params: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: vm.$cookies.get("tokenString"),
          },
        })
          .then((res) => {
            if (res.data.result) {
              if (res.data.result > 0) {
                vm.count = res.data.result;
              } else {
                vm.count = 0;
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  },
};
</script>
<style lang="less" scoped>
.detail {
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  /deep/.van-nav-bar {
    position: sticky;
    top: 0;
    .van-icon {
      color: rgb(4, 161, 106);
    }
    .van-nav-bar__text {
      color: rgb(4, 161, 106);
    }
  }
  .img {
    display: block;
    width: 100%;
    height: auto;
  }
  section {
    height: auto;
    position: relative;
    .content {
      margin-bottom: 40px;
      position: relative;
      // height: 100px;
      width: 94%;
      top: -30px;
      left: 3%;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      background-color: #fff;
      padding: 15px;
      box-sizing: border-box;
      img {
        height: 80px;
        width: auto;
        position: absolute;
        top: 10px;
        right: 15px;
        border-radius: 50%;
      }
      .name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .enname {
        color: #999;
        margin-bottom: 10px;
      }
      .price {
        font-size: 16px;
        font-weight: bold;
        color: rgb(4, 161, 106);
        margin-bottom: 20px;
      }
      .temp {
        color: #666;
        display: flex;
        height: 40px;
        .n {
          text-align: left;
          width: 60px;
          line-height: 40px;
          font-size: 14px;
        }
        .cont {
          line-height: 40px;
          flex: auto;
          span {
            width: 40px;
            padding: 7px 12px;
            background-color: rgb(214, 219, 217);
            color: rgb(99, 97, 97);
            border-radius: 20px;
            margin-right: 10px;
          }
          .active {
            background-color: rgb(4, 161, 106);
            color: #fff;
          }
        }
      }
      .count {
        height: 60px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-top: 20px;
        display: flex;
        line-height: 60px;
        .num {
          flex: auto;
          text-align: left;
          font-size: 14px;
          color: #666;
        }
        .step {
          width: 80px;
        }
      }
      /deep/.van-stepper--round .van-stepper__minus {
        color: rgb(4, 161, 106);
        border-color: rgb(4, 161, 106);
      }
      /deep/.van-stepper--round .van-stepper__plus {
        background: rgb(4, 161, 106);
      }
      .til {
        margin-top: 20px;
        color: #666;
        margin-bottom: 10px;
      }
      .intro {
        color: #999;
        margin-bottom: 5px;
      }
    }
  }
  // footer {
  //   // height: 530px;
  // }
  /deep/.van-goods-action-icon__icon {
    color: #999;
  }
}
</style>