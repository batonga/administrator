<template>
  <div class="login">
    <el-form ref="form" :model="form"  :rules="rules" class="container">
      <el-form-item>
        <div class="portrait">
          <img src="@/assets/portrait.png" />
        </div>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="账号" prefix-icon="myicon myicon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" placeholder="密码" prefix-icon="myicon myicon-key" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="login('form')" >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {checkUser} from '@/api'

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules:{
        username:[{ required: true, message: '请输入账号', trigger: 'blur' }],
        password:[{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods:{
    login(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          checkUser(this.form).then(res => {
            if(res.meta.status===200){
              localStorage.setItem('mykey', res.data.token)
              this.$router.push({name: 'Home'})
            }else{
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: 'error',
                center: true,
                duration:1500
              })
            }
          })
        } else {
          console.log('表单验证不通过')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  background:url(../assets/bg-img.png) ;
  height: 100%;
  width: 100%;
  position: fixed;
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    padding: 0px 40px 15px 40px;
    transform: translate(-50%, -50%);
    background: rgba($color: #ccc, $alpha: 0.5);
    border-radius: 12px;
    .portrait{
      width: 120px;
      height: 120px;
      margin: auto;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 0 5px #979899;
      overflow: hidden;
      img{
        display: block;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin-left: -10px;
        margin-top: -10px;
      }
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
