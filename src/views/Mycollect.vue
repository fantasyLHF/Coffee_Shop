<template>
  <div class="collect">
    <van-nav-bar
      title="个人收藏"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="bg"></div>
    <section>
      <div class="box">
        <div v-if="data.length == 0">
          还没有添加任何收藏哦！<a
            href=""
            @click.prevent="$router.push('/menu')"
            >快去收藏你喜欢的商品把！</a
          >
        </div>
        <div class="li" v-for="(v, i) in data" :key="i">
          <img :src="v.smallImg" alt="" class="img" />
          <div class="name">{{ v.name }}</div>
          <div class="enname">{{ v.enname }}</div>
          <div class="big">
            <div class="litL">
              <div class="price">{{ v.price }}</div>
            </div>
            <div class="litR" @click="delCollect(v.pid, i)">
              <van-icon name="delete" size="18" />
            </div>
          </div>
          <div class="desc">{{ v.desc }}</div>
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
      data: [],
    };
  },
  methods: {
    onClickLeft() {
      //返回
      this.$router.back();
    },
    // 删除收藏
    delCollect(id, i) {
      // 本地删除
      this.data.splice(i, 1);
      // 服务器删除
      this.axios({
        url: "/notlike",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          pid: id,
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios({
        url: "/findAllLike",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          vm.data = res.data.result;
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less" scoped>
.collect {
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
      padding: 15px 10px 0;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      .li {
        width: 40%;
        // flex: auto;
        margin: 15px;
        .img {
          border-radius: 10px;
        }
        .name {
          font-size: 14px;
        }
        .enname {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          font-size: 12px;
          color: #999;
        }
        .price {
          color: rgb(4, 161, 106);
          font-weight: bold;
        }
        .desc {
          color: #666;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 12px;
        }
        .big {
          display: flex;
          margin-top: 5px;
          .litL {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            flex: auto;
          }
          .litR {
            width: 40px;
            // background: #000;
            text-align: right;
            .van-icon {
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>