<style lang="less">
@import "./login.less";
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <p class="login-con-logo">
                <!-- <img src="../../src/images/login-logo.jpg"> -->
            </p>
            <Card :bordered="false">
                <!-- <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p> -->
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                <Icon :size="16" type="person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入用户名和密码登录</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import { login, menu } from "@/api/login.js";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      form: {
        userName: null,
        password: null
      },
      rules: {
        userName: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    getParams() {
      let obj = {
        ver: 1,
        userName: this.form.userName,
        password: this.form.password
      };
      return obj;
    },
    menuParams() {
      let obj = {
        ver: 1,
        username: this.form.userName
      };
      return obj;
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          Cookies.set("user", this.form.userName);
          //   Cookies.set("password", this.form.password);
          this.$store.commit(
            "setAvator",
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
          );
          login(this.getParams)
            .then(response => {
              if (response.data.code == 200) {
                let token = response.data.result;
                Cookies.set("token", token);
                this.$router.push({
                  name: "systemSettings"
                });
              } else {
                this.$Message.error(response.data.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    }
  }
};
</script>

<style>

</style>