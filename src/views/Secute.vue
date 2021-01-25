<template>
  <div class="secute">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <header></header>
    <section>
      <div class="box">
        <div class="flex" @click="showPopup">
          <div class="l">修改密码</div>
          <div class="r"><van-icon name="arrow" /></div>
        </div>
        <div class="flex" @click="popshow = true">
          <div class="l">注销账号</div>
          <div class="r"><van-icon name="arrow" /></div>
        </div>
      </div>
    </section>
    <van-button class="btn" type="primary" block @click="logout"
      >退出登录</van-button
    >
    <van-popup v-model="popshow" class="delpop">
      <div class="til">确定要注销吗</div>
      <div class="cont">
        <div class="l" @click="popshow = false">取消</div>
        <div class="r" @click="destory">确定</div>
      </div>
    </van-popup>
    <van-popup
      class="popup"
      v-model="show"
      position="bottom"
      :style="{ height: '40%' }"
      closeable
    >
      <div class="title">修改密码</div>
      <van-cell-group class="group">
        <van-field
          v-model="oldpassword"
          label="旧密码"
          placeholder="旧密码(必须为字母开头)"
          :right-icon="showoldpassword ? 'eye-o' : 'closed-eye'"
          :type="showoldpassword ? 'text' : 'password'"
          @click-right-icon="showoldpassword = !showoldpassword"
          maxlength="15"
        />
        <van-field
          maxlength="15"
          v-model="newpassword"
          label="新密码"
          placeholder="新密码(必须为字母开头)"
          :right-icon="shownewpassword ? 'eye-o' : 'closed-eye'"
          :type="shownewpassword ? 'text' : 'password'"
          @click-right-icon="shownewpassword = !shownewpassword"
        />
      </van-cell-group>
      <van-button type="primary" class="btns" block @click="submit"
        >提交</van-button
      >
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      show: false,
      oldpassword: "",
      newpassword: "",
      showoldpassword: false,
      shownewpassword: false,
      popshow: false,
    };
  },
  methods: {
    //   返回
    onClickLeft() {
      this.$router.back();
    },
    // 退出登录
    logout() {
      this.$cookies.remove("tokenString");
      this.$router.push("/login");
    },
    showPopup() {
      this.show = true;
    },
    // 提交
    submit() {
      if (
        /^[A-Za-z]\w{5,15}$/.test(this.oldpassword) &&
        /^[A-Za-z]\w{5,15}$/.test(this.newpassword)
      ) {
        this.axios({
          url: "/updatePassword",
          method: "POST",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            tokenString: this.$cookies.get("tokenString"),
            password: this.newpassword,
            oldPassword: this.oldpassword,
          },
        })
          .then((res) => {
            if (res.data.code == "E001") {
              this.$cookies.remove("tokenString");
              this.$router.push("/login");
              Toast(res.data.msg + ",请用新密码重新登录");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        Toast("请按格式输入密码");
      }
    },
    // 注销
    destory() {
      this.axios({
        url: "/destroyAccount",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          tokenString: this.$cookies.get("tokenString"),
        },
      })
        .then((res) => {
          Toast(res.data.msg);
          if (res.data.code == "G001") {
            this.$router.push("/login");
            // 删除token
            this.$cookies.remove("tokenString");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.secute {
  min-height: 100vh;
  background-color: rgb(242, 242, 242);
  /deep/.van-nav-bar__text {
    color: rgb(4, 161, 106);
  }
  /deep/.van-nav-bar .van-icon {
    color: rgb(4, 161, 106);
  }
  header {
    height: 100px;
    background-color: rgb(4, 161, 106);
  }
  section {
    position: relative;
    .box {
      border-radius: 10px;
      position: absolute;
      height: 120px;
      width: 94%;
      background-color: #fff;
      left: 3%;
      top: -20px;
      padding: 10px 15px;
      .flex {
        height: 50px;
        display: flex;
        .l {
          flex: auto;
          line-height: 50px;
        }
        .r {
          flex: auto;
          line-height: 50px;
          text-align: right;
        }
        &:first-child {
          border-bottom: 1px solid #eee;
        }
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    background-color: rgb(4, 161, 106);
  }
  .popup {
    padding: 15px;
    .title {
      font-size: 18px;
      color: #999;
    }
    .group {
      margin-top: 40px;
    }
    .btns {
      background-color: rgb(4, 161, 106);
      border-radius: 25px;
      margin-top: 20px;
    }
  }
  .delpop {
    border-radius: 20px;
    height: 120px;
    width: 80%;
    text-align: center;
    font-size: 15px;
    .til {
      line-height: 75px;
      height: 75px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
    }
    .cont {
      line-height: 45px;
      height: 45px;
      display: flex;
      .l {
        flex: auto;
        border-right: 1px solid #eee;
      }
      .r {
        flex: auto;
        color: #e4393c;
      }
    }
  }
}
</style>