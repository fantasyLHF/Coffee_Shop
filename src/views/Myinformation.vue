<template>
  <div class="information">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="bg">
      <div>
        可在个人页面双击对应信息进行修改哦！<a
          href=""
          @click.prevent="onClickLeft"
          >个人页面</a
        >
      </div>
    </div>
    <section>
      <div class="box">
        <div class="pic">
          头像
          <img :src="myMessage.userImg" alt="" />
        </div>
        <div class="use-id">
          用户id: <span class="id">{{ myMessage.userId }}</span>
        </div>
        <div class="use-id">
          昵称: <span class="id">{{ myMessage.nickName }}</span>
        </div>
        <div class="intro-id">
          简介:
          <span class="intro" v-if="myMessage.desc.length > 0">{{
            myMessage.desc
          }}</span
          ><span v-else class="intro">这家伙很懒，什么都没有留下！</span>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      myMessage: {
        desc: "",
      },
    };
  },
  methods: {
    onClickLeft() {
      //返回
      this.$router.back();
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios({
        url: "/findAccountInfo",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          vm.myMessage = res.data.result[0];
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less" scoped>
.information {
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
    div {
      color: #fff;
    }
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
      padding: 0 10px;
      box-sizing: border-box;
      padding-top: 15px;
      .pic {
        color: #666;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        margin-bottom: 10px;
        img {
          float: right;
          width: 40px;
          height: auto;
          border-radius: 50%;
        }
      }
      .use-id {
        color: #666;
        border-top: 1px solid #eee;
        height: 50px;
        line-height: 50px;
        .id {
          color: #999;
          float: right;
        }
      }
      .intro-id {
        color: #666;
        padding-top: 15px;
        border-top: 1px solid #eee;
        height: 80px;
        .intro {
          float: right;
          color: #999;
        }
      }
    }
  }
}
</style>