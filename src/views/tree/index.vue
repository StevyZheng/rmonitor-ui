<template>
  <div class="app-container">
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <table align="center" width="300px">
        <tr>
          <th><el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox></th>
          <th><el-button type="primary" size="small" @click="handleAdd">新建</el-button></th>
          <th><el-button type="primary" size="small" @click="handleDelete(scope.$index,scope.row)">批量删除</el-button></th>
        </tr>
      </table>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="选择" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked" @change="handleCheckItemChange" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="150">
        <template slot-scope="scope">
          {{ scope.row.explain }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updated" label="修改时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updated }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="deleted" label="删除时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.deleted }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="150" align="center">
        <!-- <template slot-scope="scope"> -->
        <!--  <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag> -->
        <!-- </template> -->
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="tableData.length"
      layout="total, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :title="dialogTitle"
      width="40%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="80px"
        size="small"
        label-position="right"
      >
        <el-form-item label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="explain">
          <el-input v-model="dataForm.explain" auto-complete="off" />
        </el-form-item>
        <el-form-item label="创建时间" prop="created">
          <el-input v-model="dataForm.created" auto-complete="off" />
        </el-form-item>
        <el-form-item label="更新时间" prop="updated">
          <el-input v-model="dataForm.updated" auto-complete="off" />
        </el-form-item>
        <el-form-item label="删除时间" prop="deleted">
          <el-input v-model="dataForm.deleted" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="small" @click.native="dialogVisible = false">取消</el-button>
        <el-button :size="small" type="primary" :loading="editLoading" @click.native="submitForm">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getRole } from '@/api/table'
import { handleEditRole, handleAddRole, handleDeleteRole } from '@/api/user'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  inject: ['reload'],
  data() {
    return {
      tableData: [],
      checkAll: false,
      listLoading: true,
      dialogTitle: '新建',
      dialogVisible: false,
      dataForm: {
        id: '',
        name: '',
        explain: ''
      },
      editLoading: false,
      currentPage: 1,
      pageSize: 5
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRole().then(response => {
        if (response.data != null) {
          this.tableData = response.data
          for (let i = 0, len = response.data.length; i < len; i++) {
            response.data[i].id = i
          }
          this.listLoading = false
        } else {
          this.$message({ message: '操作失败, ' + response.msg, type: 'error' })
          this.listLoading = false
        }
      })
    },
    handleCheckAllChange(val) {
      this.tableData.map((item, i) => {
        item.checked = val
      })
    },
    handleCheckItemChange(val) {
      for (let i = 0, l = this.tableData.length; i < l; i++) {
        if (this.tableData[i].checked !== val) {
          this.checkAll = false
          return
        }
      }
      this.checkAll = val
    },
    handleClose() {
      this.editLoading = false
    },
    handleAdd() {
      this.dialogVisible = true
      this.dialogTitle = '新建'
      this.dataForm = {
        id: '1',
        name: 'tom',
        explain: '用户'
      }
      this.dataForm.flag = 1
    },
    handleEdit(val) {
      this.dialogTitle = '修改'
      this.dataForm.id = val.index
      this.dataForm.name = val.name
      this.dataForm.explain = val.explain
      this.dialogVisible = true
      this.dataForm.flag = 2
    },
    // 批量删除
    handleDelete: function(data) {
      const names = { 'name': data.name }
      handleDeleteRole(names).then(data != null ? this.reload() : '')
    },
    // 显示编辑界
    /* handleEdit: function(params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      const rolename = []
      for (let i = 0, len = params.row.rolename.length; i < len; i++) {
        name.push(params.row.rolename[i].id)
      }
      this.dataForm.rolename = name
    },*/

    /* submitForm() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
          })
        }
      })
    },*/
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            if (params.flag === 1) {
              // const datas = { 'name': 'tom', 'password': '123456', 'email': '23322@qq.com', 'rolename': 'user' }
              handleAddRole(params).then((res) => {
                console.log(res.code)
                this.editLoading = false
                if (res.code === 204) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                  this.reload()
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.findPage(null)
              })
            }
            if (params.flag === 2) {
              const name = this.dataForm.name
              const datas = { 'before': { 'name': name }, 'after': params }
              handleEditRole(datas).then((res) => {
                this.editLoading = false
                if (res.code === 204) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                  this.reload()
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.findPage(null)
              })
            }
          })
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
    /* handleDelete:(data)=>{
      let dog = {
        name: 'Tom'
      }
      let dogs = []
      dogs.push(dog)
      console.log(dogs);
      dogs.splice(dog);
      console.log(dogs);
      console.log('dogs.length:' + dogs.length);
    }*/
  }
}
</script>
