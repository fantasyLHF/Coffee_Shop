<template>
  <div class="order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="bg">
      <van-tabbar v-model="active">
        <van-tabbar-item>全部</van-tabbar-item>
        <van-tabbar-item>进行中</van-tabbar-item>
        <van-tabbar-item>已完成</van-tabbar-item>
      </van-tabbar>
    </div>
    <section>
      <div class="box">
        <div
          class="li"
          v-for="(v, i) in data"
          :key="i"
          v-show="active == 0 ? true : active == v[0].status ? true : false"
        >
          <div class="goods">
            <div class="title">
              <div class="l">{{ i }}</div>
              <div class="r" v-if="v[0].status == 2">
                已完成 <van-icon name="delete" size="18" @click="deleteIt(i)" />
              </div>
              <div class="r" v-else @click="toFinish(v, i)">确认收货</div>
            </div>
            <van-card
              v-for="(sv, si) in v"
              :key="si"
              class="card"
              :num="sv.count"
              :price="sv.price"
              :desc="sv.enname"
              :title="sv.name"
              :thumb="sv.smallImg"
            >
              <template #tags>
                <van-tag plain type="danger">{{ sv.rule }}</van-tag>
              </template>
            </van-card>
          </div>
          <div class="sum">
            <div>{{ v | getTime }}</div>
            <div class="tips">
              <div class="tips-l">共计 {{ v | getCount }} 件</div>
              <div class="tips-r">合计 ￥{{ v | getSum }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      active: 0,
      data: {},
    };
  },
  methods: {
    onClickLeft() {
      //返回
      this.$router.push("/mine");
    },
    //确认收货
    toFinish(v, i) {
      //服务器确认
      this.axios({
        url: "/receive",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          oid: i,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((e) => {
          console.log(e);
        });
      //本地数据确认
      this.data[i][0].status = 2;
    },
    //删除订单
    deleteIt(i) {
      //本地删除
      delete this.data[i];
      this.data = { ...this.data };
      // 服务器删除
      this.axios({
        url: "/removeOrder",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          oid: i,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  filters: {
    //处理时间
    getTime(v) {
      v = new Date(v[0].createdAt);
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
    // 处理数量
    getCount(v) {
      let count = 0;
      v.forEach((d) => {
        count += d.count;
      });
      return count;
    },
    //处理价格
    getSum(v) {
      let sum = 0;
      v.forEach((d) => {
        sum += d.price * d.count;
      });
      return sum.toFixed(2);
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios({
        url: "/findOrder",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
          status: 0,
        },
      })
        .then((res) => {
          // 处理数据
          let data = {};
          res.data.result.forEach((v) => {
            if (data[v.oid]) {
              data[v.oid].push(v);
            } else {
              data[v.oid] = [];
              data[v.oid].push(v);
            }
          });
          vm.data = data;
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less" scoped>
.order {
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  /deep/.van-nav-bar__text {
    color: rgb(4, 161, 106);
  }
  /deep/.van-nav-bar .van-icon {
    color: rgb(4, 161, 106);
  }
  .bg {
    position: relative;
    height: 100px;
    background-color: rgb(4, 161, 106);
    .van-tabbar--fixed {
      left: 3%;
      width: 94%;
      position: absolute;
      bottom: -25px;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      overflow: hidden;
      .van-tabbar-item--active {
        color: rgb(4, 161, 106);
        font-weight: bold;
      }
    }
  }
  section {
    padding-bottom: 20px;
    .box {
      width: 94%;
      margin: 40px auto 0;
      .li {
        margin-bottom: 10px;
        .goods {
          position: relative;
          background-color: #fff;
          border-bottom-left-radius: -10px;
          .title {
            padding: 15px 15px 0;
            display: flex;
            .l {
              flex: auto;
              font-size: 14px;
              color: #666;
            }
            .r {
              .van-icon {
                vertical-align: top;
              }
              flex: auto;
              text-align: right;
              font-size: 14px;
              color: #666;
            }
          }
          // overflow: hidden;
          .card {
            background-color: #fff;
            .van-card__title {
              color: #333;
              font-size: 14px;
            }
            .van-card__desc {
              color: #999;
              margin: 5px 0;
            }
            .van-tag--danger.van-tag--plain {
              color: rgb(4, 161, 106);
            }
            .van-card__price {
              color: rgb(4, 161, 106);
              font-weight: bold;
            }
          }
          &::after {
            content: "";
            display: block;
            position: absolute;
            height: 20px;
            width: 20px;
            background-color: rgb(242, 242, 242);
            bottom: 0;
            left: 0;
            transform: translate(-50%, 50%);
            border-radius: 50%;
            z-index: 2;
          }
          &::before {
            content: "";
            display: block;
            position: absolute;
            height: 20px;
            width: 20px;
            background-color: rgb(242, 242, 242);
            bottom: 0;
            right: 0;
            transform: translate(50%, 50%);
            border-radius: 50%;
            z-index: 2;
          }
        }

        .sum {
          padding: 15px;
          border-top: 1px dashed #eee;
          background-color: #fff;
          color: #666;
          .tips {
            margin-top: 10px;
            display: flex;
            .tips-l {
              flex: auto;
            }
            .tips-r {
              flex: auto;
              text-align: right;
              font-size: 14px;
              font-weight: bold;
              color: rgb(4, 161, 106);
            }
          }
        }
      }
    }
  }
}
</style>