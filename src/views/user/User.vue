<template>
  <div class="user">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          v-model="query"
          @keydown.native.enter="initList"
          class="search-input"
        >
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
        <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="userList" border style="width: 100%;margin:10px 0;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column label="用户状态" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="userState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showEditDialog(scope.row)" plain icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="showDeleteUser(scope.row)"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showCheckDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加用户数据 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" ref="addUserForm" label-width="80px" :rules="rules">
        <el-form-item label="名字：" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户数据 -->
    <el-dialog title="编辑用户数据" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" ref="editUserForm" label-width="80px" :rules="rules">
        <el-form-item label="名字：" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配用户角色 -->
    <el-dialog title="分配用户角色" :visible.sync="checkDialogFormVisible">
      <el-form :model="checkForm"  label-width="120px">
        <el-form-item label="当前的用户：">
          <el-tag type="info">{{checkForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色：">
          <el-select v-model="roleId" placeholder="请选择角色">
            <el-option v-for="(role,index) in roles" :key='index' :label="role.roleName" :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkUserSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, changeUserState, addUser, getUser, editUser, deleteUser, getRolesList, assignUserRoles } from "@/api"
export default {
  data() {
    return {
      loading:true,
      userList: [],
      query: "",
      total: 0,
      pagesize: 10,
      pagenum: 1,
      addDialogFormVisible:false,
      editDialogFormVisible:false,
      checkDialogFormVisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editForm:{
        username:'',
        email:'',
        mobile:'',
        id:''
      },
      checkForm:{},
      roles:[],
      roleId:'',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '电话不能为空' }
        ]
      }
    }
  },
  created() {
    this.initList()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    },
    // 初始化表格数据
    initList() {
      this.loading = true
      getUserList({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        if(res.meta.status === 200){
          this.userList = res.data.users
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    // 改变用户状态信息
    userState(row) {
      changeUserState({uid:row.id, type:row.mg_state}).then(res => {
        if(res.meta.status === 200){
          this.$message({
            message: '设置用户状态成功',
            type: 'success'
          })
        }else{
          this.$message({
            message: res.meta.msg,
            type: 'warning'
          })
        }
      })
    },
    // 添加用户
    addUserSubmit(form) {
      this.$refs[form].validate((valid) => {
        if(valid) {
          addUser(this.addForm).then(res => {
            if(res.meta.status === 201){
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            }else if(res.meta.status === 400){
              this.$message({
                message: res.meta.msg,
                type: 'warning'
              })
            }
            this.addDialogFormVisible = false
            this.initList()
          })
        }
      })
    },
    // 显示编辑用户对话框
    showEditDialog(row) {
      this.editDialogFormVisible=true
      getUser(row.id).then(res => {
        if(res.meta.status === 200){
          this.editForm.username = res.data.username
          this.editForm.email = res.data.email
          this.editForm.mobile = res.data.mobile
          this.editForm.id = res.data.id
        }
      })
    },
    // 编辑用户提交
    editUserSubmit(form) {
      this.$refs[form].validate((valid) => {
        if(valid){
          editUser(this.editForm).then(res => {
            if(res.meta.status === 200){
              this.$message({
                message: '数据更新成功',
                type: 'success'
              })
              this.editDialogFormVisible=false
              this.initList()
            }
          })
        }
      })
    },
    // 删除单个用户
    showDeleteUser(row){
      this.$confirm('确定删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(res => {
            if(res.meta.status === 200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取角色列表
    showCheckDialog(row){
      this.checkForm = row
      this.checkDialogFormVisible=true
      getRolesList().then(res => {
        if(res.meta.status === 200){
          this.roles = res.data
        }else{
          this.$message({
            message: res.meta.msg,
            type: 'warning'
          })
        }
      })
    },
    // 分配用户角色
    checkUserSubmit(){
      if(!this.roleId){
        this.$message({
          message:'角色不能为空，请选择！',
          type: 'warning'
        })
      }else{
        assignUserRoles({id:this.checkForm.id, rid:this.roleId}).then(res => {
          if(res.meta.status === 200){
            this.$message({
              message:'设置角色成功',
              type: 'success'
            })
            this.checkDialogFormVisible=false
          }else{
            this.$message({
              message:res.meta.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>
