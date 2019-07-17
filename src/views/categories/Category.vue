<template>
  <div class="category">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="success" plain @click="addCategory">添加商品</el-button>
      </el-col>
    </el-row>
    <tree-grid
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    ></tree-grid>
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
    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" ref="addCategoryForm" label-width="80px" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader v-model="value" :options="options" @change="handleChange" :props="props"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategorySubmit('addCategoryForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreeGrid from "@/components/TreeGrid/TreeGrid"
import { getCategoryList, addCategoryList } from "@/api"
export default {
  data() {
    return {
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addDialogFormVisible: false,
      // 级联选择器数据源
      options: [],
      // 选中项绑定值
      value: [],
      // 可选项数据源，键名可通过 Props 属性配置
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      total: 0,
      pagesize: 10,
      pagenum: 1,
      dataSource: [],
      columns: [
        {
          text: "分类名称",
          dataIndex: "cat_name",
          width: ""
        },
        {
          text: "是否有效",
          dataIndex: "cat_deleted",
          width: ""
        },
        {
          text: "排序",
          dataIndex: "cat_level",
          width: ""
        }
      ],
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.initList()
  },
  components: {
    TreeGrid
  },
  methods: {
    deleteCategory(cid) {
      console.log(cid)
    },
    editCategory(cid) {
      console.log(cid)
    },
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
    initList() {
      getCategoryList({
        type: 3,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        if (res.meta.status === 200) {
          this.total = res.data.total
          this.dataSource = res.data.result
        }
      })
    },
    handleChange(value) {
      console.log(value)
    },
    addCategory() {
      this.addDialogFormVisible = true
      getCategoryList({type:2}).then(res => {
        if(res.meta.status === 200) {
          this.options = res.data
        }
      })
    },
    addCategorySubmit(form) {
      this.$refs[form].validate((valid) => {
        if(valid) {
          if(this.value.length === 0) {
            this.addForm.cat_pid = 0
            this.addForm.cat_level = 0
          }else if(this.value.length === 1) {
            this.addForm.cat_pid = this.value[this.value.length-1]
            this.addForm.cat_level = 1
          }else {
            this.addForm.cat_pid = this.value[this.value.length-1]
            this.addForm.cat_level = 2
          }
          addCategoryList(this.addForm).then(res => {
            if(res.meta.status === 201){
              this.addDialogFormVisible = false
              this.initList()
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
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  padding: 5px 0;
  background-color: #d3dce6;
}
</style>
