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
      <h1>欢迎回来!</h1>
      <div class="little-title">Please login to your accounts</div>
      <van-cell-group class="text">
        <van-field
          class="username"
          v-model="login.phone"
          label="手机号"
          placeholder="请输入手机号"
          type="text"
        />
        <van-field
          class="password"
          v-model="login.password"
          label="密码"
          placeholder="请输入密码"
          :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
          :type="showPassword ? 'text' : 'password'"
          @click-right-icon="showPassword = !showPassword"
        />
      </van-cell-group>
      <div class="forget"><span @click="tofind">忘记密码？</span></div>
      <van-button round class="login-btn" block type="default" @click="gologin"
        >登&nbsp;&nbsp;&nbsp;录</van-button
      >

      <van-button
        @click="showPopup"
        round
        class="register-btn"
        block
        type="default"
        >注&nbsp;&nbsp;&nbsp;册</van-button
      >
      <!-- 隐藏的注册页 -->
      <van-popup
        class="registerlist"
        v-model="show"
        position="bottom"
        :style="{ height: '50%' }"
        closeable
        close-icon-position="top-right"
      >
        <h2>注册</h2>
        <van-field
          class="registerb"
          v-model="register.phone"
          label="手机号"
          placeholder="11位手机号"
        />
        <van-cell-group>
          <van-field
            v-model="register.password"
            label="密码"
            placeholder="密码必须为字母开头"
            :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
            :type="showPassword ? 'text' : 'password'"
            @click-right-icon="showPassword = !showPassword"
          />
          <van-field
            v-model="register.nickname"
            label="昵称"
            placeholder="昵称"
          />
        </van-cell-group>
        <van-button @click="goRegister" round block class="bot-btn"
          >注册</van-button
        >
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";
import { utils } from "../assets/js/utils";
import { Toast } from "vant";
export default {
  data() {
    return {
      login: {
        //登录表单数据
        phone: "",
        password: "",
      },
      register: {
        //注册表单数据
        phone: "",
        password: "",
        nickname: "",
      },
      showPassword: false, //密码的眼睛
      show: false, //控制注册页
    };
  },
  name: "Login",
  methods: {
    gohome() {
      //先逛一逛按钮
      this.$router.push("/");
    },
    gologin() {
      // 登录
      let o = {
        phone: {
          value: this.login.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "请输入正确的手机号",
        },

        password: {
          value: this.login.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "请输入正确格式的密码",
        },
      };
      if (!utils.validForm(o)) {
        return;
      }
      this.axios({
        method: "POST",
        url: "/login",
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          password: this.login.password,
          phone: this.login.phone,
        },
      })
        .then((res) => {
          //登录成功
          Toast(res.data.msg);
          if (res.data.code == 200) {
            let tokenString = res.data.token;
            //配置cookies生命周期，单位不区分大小写
            this.$cookies.config("1d");
            this.$cookies.set("tokenString", tokenString);
            this.$router.push({ path: "/" });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    showPopup() {
      //是否注册弹出
      this.show = true;
    },
    goRegister() {
      //点击注册
      let o = {
        phone: {
          value: this.register.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },

        password: {
          value: this.register.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },

        nickName: {
          value: this.register.nickname,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
      };
      //验证表单
      if (!utils.validForm(o)) {
        return;
      }
      this.axios({
        //请求方式
        method: "POST",
        url: "/register",
        //如果是POST请求，参数需要挂载到data
        //要在拦截器中处理参数
        //a=1&b=2&c=3
        data: {
          appkey: "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=",
          nickName: this.register.nickname,
          password: this.register.password,
          phone: this.register.phone,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
          this.show = false;
          // 清空注册
          for (let k in this.register) {
            this.register[k] = "";
          }
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    // 找回密码
    tofind() {
      this.$router.push("/findpassword");
    },
  },
};
</script>
