<template>
  <div class="roles">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-button class="mb-15" type="primary" @click="addDialogFormVisible=true" plain>添加角色</el-button>
    <el-table :data="rolesList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">该角色没有分配权限，请前往分配！</el-col>
          </el-row>
          <el-row v-for="firstChildren in scope.row.children" :key="firstChildren.id">
            <el-col :span="3">
              <el-tag
                @close="deleRolesRight(scope.row,firstChildren.id)"
                closable
              >{{firstChildren.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="21">
              <el-row v-for="secondChildren in firstChildren.children" :key="secondChildren.id">
                <el-col :span="3">
                  <el-tag
                    @close="deleRolesRight(scope.row,secondChildren.id)"
                    type="success"
                    closable
                  >{{secondChildren.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="21">
                  <el-tag
                    @close="deleRolesRight(scope.row,thirdChildren.id)"
                    type="warning"
                    v-for="thirdChildren in secondChildren.children"
                    :key="thirdChildren.id"
                    closable
                  >{{thirdChildren.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="editDialog(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="deleteDialog(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="warning"
            plain
            icon="el-icon-check"
            @click="checkDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="授权角色" :visible.sync="dialogFormVisible">
      <div class="role-tree">
        <el-tree
          ref="tree"
          :data="roleList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="checkedRoles"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submintRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色数据 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" ref="addUserForm" label-width="120px" :rules="rules">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色数据 -->
    <el-dialog title="编辑角色数据" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" ref="editUserForm" label-width="120px" :rules="rules">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRolesList,
  deleteRoleRight,
  getRightsList,
  roleAuthorization,
  addRole,
  getRoleById,
  editRole,
  deletRole
} from "@/api"
export default {
  data() {
    return {
      rolesList: [],
      dialogFormVisible: false,
      checkedRoles: [], // 保存默认选中数组的id
      currentRoles: {}, // 选中的角色
      roleList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      addDialogFormVisible: false,
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ]
      },
      editDialogFormVisible: false,
      editForm: {
        id: 0,
        roleName: "",
        roleDesc: ""
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getRolesList().then(res => {
        if (res.meta.status === 200) {
          this.rolesList = res.data
        }
      })
    },
    deleRolesRight(row, rightId) {
      deleteRoleRight({ roleId: row.id, rightId: rightId }).then(res => {
        row.children = res.data
      })
    },
    checkDialog(row) {
      this.dialogFormVisible = true
      this.currentRoles = row
      getRightsList({ type: "tree" }).then(res => {
        if (res.meta.status === 200) {
          this.roleList = res.data
        } else {
          this.$message({
            message: res.meta.msg,
            type: "warning"
          })
        }
      })
      this.checkedRoles.length = 0
      this.currentRoles.children.forEach(first => {
        if (first.children && first.children.length !== 0) {
          first.children.forEach(second => {
            if (second.children && second.children.length !== 0) {
              second.children.forEach(third => {
                this.checkedRoles.push(third.id)
              })
            }
          })
        }
      })
    },
    // 确认修改角色权限
    submintRoles() {
      let rids = this.$refs.tree.getCheckedKeys().join(",")
      roleAuthorization(this.currentRoles.id, { rids: rids }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: "success"
          })
          this.dialogFormVisible = false
          this.init()
        }
      })
    },
    // 添加角色
    addUserSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          addRole(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                message: res.meta.msg,
                type: "success"
              })
              this.addDialogFormVisible = false
              this.init()
            } else {
              this.$message({
                message: res.meta.msg,
                type: "warning"
              })
            }
          })
        }
      })
    },
    // 根据ID查询角色
    editDialog(row) {
      this.editDialogFormVisible = true
      getRoleById(row.id).then(res => {
        if (res.meta.status === 200) {
          this.editForm.roleName = res.data.roleName
          this.editForm.roleDesc = res.data.roleDesc
          this.editForm.id = res.data.roleId
        }
      })
    },
    // 编辑提交角色
    editRoleSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          editRole(this.editForm).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                message: "数据更新成功",
                type: "success"
              })
              this.editDialogFormVisible = false
              this.init()
            }
          })
        }
      })
    },
    // 删除角色
    deleteDialog(row) {
      this.$confirm("正在删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletRole(row.id).then(res => {
          console.log(res)
          if(res.meta.status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            })
            this.init()
          }
        })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.mb-15 {
  margin-bottom: 15px;
}
.roles {
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .role-tree {
    height: 300px;
    overflow: auto;
  }
}
</style>
