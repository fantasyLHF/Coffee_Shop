<template>
  <div class="mine">
    <div class="secute" @click.stop="gotosecute">
      安全中心 <van-icon name="share" />
    </div>
    <!-- 背景图 -->
    <header
      @click.stop="changeBgImg('input')"
      :style="{ backgroundImage: `url('${myMessage.userBg}')` }"
    >
      <!-- 配合上传 -->
      <input
        type="file"
        @change.stop="inputBg('input')"
        ref="input"
        class="input"
      />
    </header>
    <section>
      <div class="position">
        <!-- 配合上传 -->
        <input
          type="file"
          @change.stop="inputBg('inputs')"
          ref="inputs"
          class="input"
        />
        <img
          :src="myMessage.userImg"
          alt=""
          @click.stop="changeBgImg('inputs')"
        />
        <div class="content">
          <div class="name" @click="dbclick">
            <span v-if="nameflag"> {{ myMessage.nickName }}</span>
            <input
              ref="nameinput"
              class="name-input"
              v-else
              type="text"
              v-model="myMessage.nickName"
              maxlength="8"
              @keydown.enter="changeName"
              @blur="changeName"
            />
          </div>
          <div>{{ time }}</div>
          <div v-if="introflag" @click="clickintro">
            <div class="intro" v-if="myMessage.desc.length > 0">
              {{ myMessage.desc }}
            </div>
            <div class="intro" v-else>这个人很懒什么都没有留下!</div>
          </div>
          <textarea
            maxlength="20"
            ref="text"
            class="textarea"
            v-else
            name=""
            id=""
            cols="30"
            rows="10"
            v-model="myMessage.desc"
            @keydown.enter="changeintro"
            @blur="changeintro"
          ></textarea>
        </div>
      </div>
      <div class="title">我的咖啡俱乐部</div>
      <div class="list" @click="goto('/myinformation')">
        <img src="../assets/img/个人资料.png" />个人资料<van-icon
          name="arrow"
        />
      </div>
      <div class="list" @click="goto('/myorder')">
        <img src="../assets/img/我的订单.png" />我的订单<van-icon
          name="arrow"
        />
      </div>
      <div class="list" @click="goto('/mycollect')">
        <img src="../assets/img/我的收藏.png" />我的收藏<van-icon
          name="arrow"
        />
      </div>
      <div class="list" @click="goto('/myaddr')">
        <img src="../assets/img/地址管理.png" />地址管理<van-icon
          name="arrow"
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
      time: "",
      nowTime: 0, //当前点击事件
      nameflag: true,
      introflag: true,
      myMessage: {
        nickName: "未登录",
        desc: "",
        userBg: "",
        userImg: "",
      },
    };
  },
  methods: {
    goto(path) {
      this.$router.push(path);
    },
    // 跳转到安全中心
    gotosecute() {
      this.$router.push("/secute");
    },
    // 改变名
    changeName() {
      this.nameflag = true;
      //上传到后台
      this.axios({
        url: "/updateNickName",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          nickName: this.myMessage.nickName,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 改变简介
    changeintro() {
      this.introflag = true;
      //上传到后台
      this.axios({
        url: "/updateDesc",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
          desc: this.myMessage.desc,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 插入背景图
    changeBgImg(element) {
      let nowTime = new Date().getTime();
      if (nowTime - this.nowTime < 300) {
        this.$refs[element].click();
      }
      this.nowTime = nowTime;
    },
    // 插入背景和上传
    inputBg(element) {
      let str = "";
      let str2 = "";
      if (element == "input") {
        str = "UserBg";
        str2 = "userBg";
      } else {
        str = "Avatar";
        str2 = "userImg";
      }
      var file = this.$refs[element].files;
      let imgType = file[0].name.split(".")[file[0].name.split(".").length - 1];
      var reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = function () {
        let src = reader.result;
        // 改变背景及上传背景图片
        this.myMessage[str2] = src;
        this.axios({
          url: "/update" + str,
          method: "POST",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: this.$cookies.get("tokenString"),
            imgType: imgType,
            serverBase64Img: src.split(",")[src.split(",").length - 1],
          },
        })
          .then((res) => {
            Toast(res.data.msg);
          })
          .catch((e) => {
            console.log(e);
          });
      }.bind(this);
    },
    // 改名字
    dbclick() {
      let nowTime = new Date().getTime();
      if (nowTime - this.nowTime < 300) {
        this.nameflag = false;
        Toast("请按enter键修改或退出");
        this.$nextTick(() => {
          this.$refs.nameinput.focus();
        });
      }
      this.nowTime = nowTime;
    },
    // 改简介
    clickintro() {
      let nowTime = new Date().getTime();
      if (nowTime - this.nowTime < 300) {
        this.introflag = false;
        Toast("请按enter键修改或退出");
        this.$nextTick(() => {
          this.$refs.text.focus();
        });
      }
      this.nowTime = nowTime;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$cookies.get("tokenString") == undefined) {
        vm.$router.push("/login");
      }
      // 设置事件
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDay();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      vm.nowTime = date.getTime();
      vm.time = year + "/" + month + "/" + day;
      // 获取个人数据
      vm.axios({
        url: "findMy",
        method: "GET",
        params: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: vm.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          if (res.data.result) {
            vm.myMessage = res.data.result[0];
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  },
};
</script>
<style lang="less">
.mine {
  position: relative;
  height: calc(100vh - 50px);
  .secute {
    text-shadow: 2px 2px 2px #000;
    position: absolute;
    top: 0;
    right: 0;
    color: #fff;
    z-index: 5;
  }
  header {
    .input {
      display: block;
      width: 0;
      height: 0;
    }
    background-color: rgb(4, 161, 106);
    height: 180px;
    background: url("../assets//img/mine.jpg") no-repeat center;
    background-size: 100% 100%;
    filter: blur(5px);
  }
  section {
    height: calc(100vh - 180px);
    padding: 0 15px;
    background-color: rgb(247, 247, 247);
    position: relative;
    .position {
      .input {
        display: block;
        width: 0;
        height: 0;
      }
      position: absolute;
      height: 100px;
      width: 90%;
      background-color: rgba(255, 255, 255);
      transform: translateY(-50%);
      left: 5%;
      border-radius: 10px;
      display: flex;
      img {
        margin-top: 10px;
        margin-left: 10px;
        height: 80px;
        width: auto;
        border-radius: 50%;
      }
      .content {
        .textarea {
          height: 30px;
          resize: none;
        }
        margin-left: 10px;
        flex: auto;
        .name {
          margin: 20px 0 10px;
          font-size: 20px;
          font-weight: bold;
          color: rgb(4, 161, 106);
          font-style: italic;
          .name-input {
            width: 120px;
            outline: none;
          }
        }
        .intro {
          color: #aaa;
        }
      }
    }
    .title {
      padding-top: 70px;
      color: #999;
      margin-bottom: 20px;
    }
    .list {
      height: 50px;
      border-bottom: 1px solid rgb(235, 233, 233);
      line-height: 50px;
      img {
        width: 25px;
        height: auto;
        vertical-align: middle;
        margin-right: 10px;
      }
      .van-icon {
        float: right;
        margin-top: 20px;
        margin-right: 5px;
      }
    }
  }
}
</style>