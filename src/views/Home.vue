<template>
  <div class="home">
    <el-container>
      <!-- 侧边栏部分 begin-->
      <el-aside width="auto">
        <div class="logo"></div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          active-text-color
           :collapse="isCollapse"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">用户管理列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 侧边栏部分end -->
      <el-container>
        <!-- Header 部分begin -->
        <el-header>
          <i class="myicon myicon-menu toggle-btn" @click="toggleCollapse"></i>
          <div class="system-title">vue电商后台系统</div>
          <div>
            <span class="welcome ">您好，xxx</span>
            <el-button type="text" class="back" @click="back">退出</el-button>
          </div>
        </el-header>
        <!-- Header 部分end -->
        <!-- Main 部分 begin -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- Main 部分 end -->
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getUserList } from "@/api"
export default {
  data() {
    return {
      isCollapse: false
    }
  },
  mounted() {
    let obj = { params: { query: "", pagenum: 1, pagesize: 1 } }
    getUserList(obj).then(res => {
      console.log(res)
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    back(){
      localStorage.removeItem('mykey')
      this.$router.push({name: 'Login'})
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  background-color: #e5e5e5;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    border-right: 0;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #009688;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: white;
  }
  .toggle-btn {
    padding: 0 10px;
    margin-left: -20px;
    font-size: 36px;
    line-height: 60px;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #00635a;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
  .back{
    color: #f00;
  }
}
</style>
