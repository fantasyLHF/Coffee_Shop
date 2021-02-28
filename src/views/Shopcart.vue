<template>
  <div class="shop-cart">
    <header>
      <div class="title">购物车</div>
      <div class="count">共{{ list.length }}件宝贝</div>
      <div class="edit" @click="changeManager">
        {{ flag ? "管理" : "完成" }}
      </div>
      <div class="wait" v-if="list.length == 0">购物车还没有商品！</div>
    </header>
    <!-- 商品 -->
    <section>
      <div class="box">
        <div class="list" v-for="(v, i) in list" :key="i">
          <van-swipe-cell>
            <van-card
              :price="v.price"
              :desc="v.enname"
              class="goods-card"
              :thumb="v.small_img"
            >
              <template #title>
                <div class="title" plain type="danger">
                  {{ v.name }}
                  <van-checkbox
                    v-model="checks[i]"
                    @change="check(i)"
                  ></van-checkbox>
                </div>
              </template>
              <template #tags>
                <van-tag class="todel" plain type="danger">&lt;==</van-tag>
                <van-tag plain>{{ v.rule }}</van-tag>
                <van-tag class="step" plain
                  ><van-stepper
                    v-model="v.count"
                    theme="round"
                    button-size="22"
                    disable-input
                    @change="changeNum(v.count, v.sid)"
                /></van-tag>
              </template>
            </van-card>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="delshop(v.sid, i)"
              />
            </template>
          </van-swipe-cell>
        </div>
        <div class="footer">&lt;== 购物车全部展示了哦！ ==&gt;</div>
      </div>
    </section>
    <!-- 提交 -->
    <van-submit-bar
      v-if="flag"
      :price="sum"
      button-text="提交订单"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checked" @click="changeAll">全选</van-checkbox>
    </van-submit-bar>
    <!-- 删除 -->
    <van-submit-bar
      class="del"
      v-else
      button-text="删除选择"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checked" @click="changeAll"> 全选 </van-checkbox>
    </van-submit-bar>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      list: [],
      checked: true,
      checks: [],
      flag: true, //控制管理
    };
  },
  methods: {
    //改变管理
    changeManager() {
      this.flag = !this.flag;
    },
    check() {
      //每一个选或不选
      let flag = true;
      this.checks.forEach((v) => {
        if (v == false) {
          flag = false;
        }
      });
      this.checked = flag;
    },
    changeAll() {
      if (!this.checked) {
        this.checks.forEach((v, i) => {
          this.checks[i] = false;
        });
        this.checks = [...this.checks];
      } else {
        this.checks.forEach((v, i) => {
          this.checks[i] = true;
        });
        this.checks = [...this.checks];
      }
    },
    //提交或删除
    onSubmit() {
      if (this.flag) {
        if (this.checks.length == 0) {
          Toast("请向购物车添加商品后，再提交");
          return;
        }
        let arrt = [];
        for (var j = 0; j < this.checks.length; j++) {
          if (this.checks[j] == true) {
            arrt.push(this.list[j].sid);
            // this.checks.splice(i, 1);
            // this.list.splice(i, 1);
            // i--;
          }
        }
        this.$router.push({ path: "/ordersettle", query: { arr: arrt } });
      } else {
        // 删除
        let arr = [];
        for (var i = 0; i < this.checks.length; i++) {
          if (this.checks[i] == true) {
            arr.push(this.list[i].sid);
            this.checks.splice(i, 1);
            this.list.splice(i, 1);
            i--;
          }
        }
        this.axios({
          url: "/deleteShopcart",
          method: "POST",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: this.$cookies.get("tokenString"),
            sids: JSON.stringify(arr),
          },
        })
          .then((res) => {
            Toast(res.data.msg);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      //购物车数量
      let allcount = 0;
      this.list.forEach((v) => {
        allcount += v.count;
      });
      this.$emit("changeNum", allcount);
    },
    // 删除商品
    delshop(sid, i) {
      this.axios({
        url: "/deleteShopcart",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          sids: JSON.stringify([sid]),
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((e) => {
          console.log(e);
        });
      this.list.splice(i, 1);
      this.checks.splice(i, 1);
      //购物车数量
      let allcount = 0;
      this.list.forEach((v) => {
        allcount += v.count;
      });
      this.$emit("changeNum", allcount);
    },
    changeNum(count, sid) {
      //改变数值
      this.axios({
        url: "/modifyShopcartCount",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          sid: sid,
          count: count,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((e) => {
          console.log(e);
        });
      let allcount = 0;
      this.list.forEach((v) => {
        allcount += v.count;
      });
      this.$emit("changeNum", allcount);
    },
  },
  computed: {
    sum() {
      //计算总价格
      let sum = 0;
      this.list.forEach((v, i) => {
        if (this.checks[i]) {
          sum += v.price * v.count;
        }
      });
      return sum * 100;
    },
  },
  beforeRouteEnter(to, from, next) {
    //查询所有数据
    next((vm) => {
      vm.axios({
        url: "/findAllShopcart",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          if (res.data.result) {
            vm.list = res.data.result;
            vm.list.forEach((v, i) => {
              vm.checks[i] = true;
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less" scoped>
.shop-cart {
  .van-submit-bar {
    bottom: 50px;
    /deep/.van-checkbox__icon--checked .van-icon {
      background: rgb(4, 161, 106);
      border-color: rgb(4, 161, 106);
    }
  }
  min-height: calc(100vh - 50px);
  background-color: rgb(242, 242, 242);
  header {
    position: relative;
    height: 180px;
    box-sizing: border-box;
    padding: 20px 15px;
    background-color: rgb(4, 161, 106);
    color: #fff;
    .title {
      font-size: 20px;
      font-weight: 700;
    }
    .count {
      margin-top: 15px;
    }
    .edit {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 16px;
    }
  }
  section {
    position: relative;
    height: calc(100% - 70px);
    .box {
      position: relative;
      top: -80px;
      left: 3%;
      width: 94%;
      .wait {
        color: #fff;
      }
      .list {
        .goods-card {
          margin: 0;
          background-color: #fff;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          margin-bottom: 10px;
          .van-icon {
            color: rgb(4, 161, 106);
            vertical-align: middle;
          }
          .title {
            font-size: 14px;
            margin-top: 5px;
            margin-bottom: 5px;
            color: #666;
            .van-checkbox {
              position: absolute;
              right: 0;
            }
            /deep/.van-checkbox__icon--checked .van-icon {
              color: #fff;
              background-color: rgb(4, 161, 106);
              border-color: rgb(4, 161, 106);
            }
          }
          .van-card__price {
            color: rgb(4, 161, 106);
            font-weight: bold;
          }
          .van-card__desc {
            margin-top: 5px;
          }
          .todel {
            color: rgb(4, 161, 106);
            font-weight: bold;
            position: absolute;
            top: 0;
            right: 0;
          }
          .van-tag--plain::before {
            border: none;
          }
          .step {
            border: none;
            right: 0;
            bottom: 0;
            position: absolute;
            /deep/.van-stepper--round .van-stepper__minus {
              color: rgb(4, 161, 106);
              border-color: rgb(4, 161, 106);
            }
            /deep/.van-stepper--round .van-stepper__plus {
              background-color: rgb(4, 161, 106);
            }
          }
        }
        .delete-button {
          height: 100%;
        }
      }
      .footer {
        text-align: center;
        color: rgb(4, 161, 106);
      }
    }
  }
  .del {
    /deep/.van-checkbox {
      position: relative;
      left: -160px;
    }
  }
}
</style>