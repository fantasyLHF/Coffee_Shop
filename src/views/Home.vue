<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar>
      <template #left class="ltop">
        <span class="l"> {{ time }}好</span
        ><span class="r">{{ username }}</span>
      </template>
      <template #right>
        <van-search v-model="value" placeholder="输入商品名称" shape="round" />
      </template>
    </van-nav-bar>
    <section>
      <!-- 轮播图 -->
      <van-swipe :autoplay="30000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img v-lazy="image" class="trunImg" />
        </van-swipe-item>
      </van-swipe>
      <!-- 热卖推荐 -->
      <div class="hotIntro">
        <div class="block">热卖推荐</div>
      </div>
      <!-- 热卖列表 -->
      <div class="hotlist">
        <div class="list" v-for="(v, i) in hotdata" :key="i">
          <div class="imgbox">
            <div class="tips">hot</div>
            <img :src="v.largeImg" alt="" />
          </div>
          <div class="name">{{ v.name }}</div>
          <div class="English">{{ v.enname }}</div>
          <div class="price">￥{{ v.price }}</div>
        </div>
      </div>
    </section>
    <!-- 底部占位 -->
    <div class="footer"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      time: "下午",
      username: "Hokv",
      images: [],
      hotdata: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //设置进入页面时间
      let v = new Date().getHours();
      if (v < 4) {
        vm.time = "凌晨";
      } else if (v < 8) {
        vm.time = "早晨";
      } else if (v < 11) {
        vm.time = "上午";
      } else if (v < 13) {
        vm.time = "中午";
      } else if (v < 17) {
        vm.time = "下午";
      } else if (v < 19) {
        vm.time = "傍晚";
      } else {
        vm.time = "晚上";
      }

      vm.axios("/banner?" + vm.$store.state.appkey).then((data) => {
        data.data.result.forEach((v) => {
          vm.images.push(v.bannerImg);
        });
      });
      vm.axios(
        "/typeProducts?key=isHot&value=1&" + vm.$store.state.appkey
      ).then((data) => {
        vm.hotdata = data.data.result;
        console.log(vm.hotdata);
      });
    });
  },
};
</script>
<style lang="less" scoped>
.home {
  .van-nav-bar {
    overflow: hidden;
    .van-nav-bar__left {
      .l {
        font-weight: bold;
        color: #666;
      }
      .r {
        padding-left: 5px;
        color: rgb(4, 161, 106);
        font-weight: bold;
      }
    }
    /deep/.van-icon-search {
      color: rgb(4, 161, 106);
    }
  }
  section {
    margin-top: -30px;
    padding: 10px;
    background-color: rgb(247, 247, 247);
    .van-swipe {
      border-radius: 20px;
      overflow: hidden;
      .van-swipe__track {
        padding: 0;
        margin: 0;
      }
    }
    .hotIntro {
      height: 40px;
      background-color: #fff;
      margin-top: 10px;
      padding-top: 5px;
      margin-bottom: 10px;
      .block {
        height: 30px;
        width: 75px;
        background-color: rgb(4, 161, 106);
        color: #fff;
        text-align: center;
        line-height: 30px;
        border-top-right-radius: 15px;
      }
    }
    .hotlist {
      flex-wrap: wrap;
      display: flex;
      justify-content: space-between;
      .list {
        margin-bottom: 10px;
        background-color: #fff;
        border-radius: 10px;
        width: 48.5%;
        padding: 8px;
        // background-color: green;
        .imgbox {
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          .tips {
            position: absolute;
            top: 0;
            left: 5px;
            height: 20px;
            width: 25px;
            background-color: rgb(4, 161, 106);
            color: #fff;
            text-align: center;
            line-height: 25px;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          img {
            width: 100%;
            height: auto;
          }
        }
        .name {
          font-size: 16px;
          color: #666;
          padding-top: 3px;
          margin-bottom: 6px;
        }
        .English {
          color: #999;
          margin-bottom: 10px;
        }
        .price {
          color: rgb(4, 161, 106);
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
  .footer {
    height: 50px;
  }
}
</style>