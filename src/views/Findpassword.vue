<template>
  <div class="login">
    <!-- 头部 -->
    <van-nav-bar @click-right="gohome">
      <template #left>
        <img class="img" src="../assets/img/favicon.png" alt="" />
        <div class="logo-title">Hokv Coffee</div>
      </template>
      <template #right>
        <div class="logo-left">先逛一逛</div>
      </template>
    </van-nav-bar>
    <!-- 内容区 -->
    <div class="box">
      <h1>找回密码!</h1>
      <div class="little-title">Find password</div>
      <van-cell-group class="text">
        <van-field
          v-show="flag"
          class="username"
          v-model="email"
          label="邮箱"
          placeholder="请输入邮箱地址"
          type="text"
        />
        <van-field
          v-show="flag"
          class="sms"
          v-model="sms"
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码"
        >
          <template #button>
            <van-button size="small" type="primary" @click="sendtest"
              >发送验证码</van-button
            >
          </template>
        </van-field>
        <van-field
          v-show="!flag"
          class="username"
          v-model="phone"
          label="手机号"
          placeholder="请输入手机号"
          type="text"
        />
        <van-field
          v-show="!flag"
          class="password"
          v-model="password"
          label="密码"
          placeholder="请输入新密码(首字符为字母)"
          :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
          :type="showPassword ? 'text' : 'password'"
          @click-right-icon="showPassword = !showPassword"
        />
      </van-cell-group>
      <div class="forget">
        <span @click="gotologin">已有账号，立即登录</span>
      </div>
      <van-button
        v-show="flag"
        round
        class="login-btn"
        block
        type="default"
        @click="nextstep"
        >下一步</van-button
      >
      <van-button
        v-show="!flag"
        round
        class="login-btn"
        block
        type="default"
        @click="submit"
        >提&nbsp;&nbsp;&nbsp;交</van-button
      >

      <van-button
        v-show="!flag"
        @click="comback"
        round
        class="register-btn"
        block
        type="default"
        >返&nbsp;&nbsp;&nbsp;回</van-button
      >
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import "../assets/less/login.less";
export default {
  data() {
    return {
      flag: true,
      email: "",
      showPassword: false, //密码的眼睛
      sms: "",
      phone: "",
      password: "",
    };
  },
  methods: {
    gohome() {
      //先逛一逛按钮
      this.$router.push("/");
    },
    //有账号
    gotologin() {
      this.$router.push("/login");
    },
    // 发送验证码
    sendtest() {
      //判断邮箱是否合法
      if (
        /^[A-Za-z0-9]+([_\\.][A-Za-z0-9]+)*@([A-Za-z0-9\\-]+\.)+[A-Za-z]{2,6}$/.test(
          this.email
        )
      ) {
        this.axios({
          url: "/emailValidCode",
          method: "POST",
          data: {
            appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
            email: this.email,
          },
        })
          .then((res) => {
            Toast(res.data.msg);
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        Toast("请输入正确的邮箱地址");
      }
    },
    // 下一步
    nextstep() {
      this.axios({
        url: "/checkValidCode",
        method: "POST",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          validCode: this.sms,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
          if (res.data.code == "K001") {
            this.flag = false;
          }
          console.log(res);
        })
        .then((e) => {
          console.log(e);
        });
    },
    // 提交
    submit() {
      if (/^1[3-9]\d{9}$/.test(this.phone)) {
        if (/^[A-Za-z]\w{5,15}$/.test(this.password)) {
          this.axios({
            url: "/retrievePassword",
            method: "POST",
            data: {
              appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
              phone: this.phone,
              password: this.password,
            },
          })
            .then((res) => {
              Toast(res.data.msg + "");
              if (res.data.code == "L001") {
                this.$router.push("/login");
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          Toast("请输入正确格式的密码");
        }
      } else {
        Toast("请输入正确的手机号");
      }
    },
    // 返回
    comback() {
      this.flag = true;
    },
  },
};
</script>
