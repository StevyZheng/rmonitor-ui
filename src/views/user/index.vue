<template>
  <div class="app-container">
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <table align="center" width="100px">
        <tr>
          <th><el-button type="primary" size="small" @click="handleAdd">新建</el-button></th>
          <th><el-button type="primary" size="small" @click="handleDelete">批量删除</el-button></th>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" lign="center" label="选择" width="55" />
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
      <el-table-column label="所属租户" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" width="150">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updated_at" label="修改时间" width="250">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="250" align="center">
        <!-- <template slot-scope="scope"> -->
        <!--  <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag> -->
        <!-- </template> -->
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" size="small" @click="handleEditPassword(scope.row)">修改密码</el-button>
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
      title="新建"
      width="40%"
      :visible.sync="dialogAddVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="rules"
        label-width="80px"
        size="small"
        label-position="right"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属角色" prop="roleName">
          <el-input v-model="dataForm.roleName" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="dialogAddVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="submitAddEditForm">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改"
      width="40%"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="rules"
        label-width="80px"
        size="small"
        label-position="right"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属角色" prop="roleName">
          <el-input v-model="dataForm.roleName" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="dialogEditVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="submitAddEditForm">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改密码"
      width="25%"
      :visible.sync="dialogEditPwdVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="80px"
        size="small"
        label-position="right"
      >
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passwordForm.password" type="password" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="dialogEditPwdVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="submitEditPwdForm">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/table'
import { handleEditUser, handleAddUser, handleDeleteUser, handleDeleteUsers } from '@/api/user'
import { validateEMail } from '@/utils/validate'
import md5 from 'js-md5'
import { parseTime } from '../../utils'

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
      checkedList: [],
      checkAll: false,
      listLoading: true,
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogEditPwdVisible: false,
      passwordForm: {
        name: '',
        password: ''
      },
      passwordRules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不允许小于6位' }
        ]
      },
      dataForm: {
        name: '',
        password: '',
        email: '',
        roleName: ''
      },
      rules: {
        name: [
          { required: true, type: 'string', message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不允许小于6位' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEMail }
        ],
        roleName: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      editLoading: false,
      currentPage: 1,
      pageSize: 5,
      passwordInputEnable: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        console.log(response.data)
        this.tableData = response.data
        for (let i = 0, len = response.data.length; i < len; i++) {
          response.data[i].id = i
          this.tableData[i].id = i
          this.tableData[i].updated_at = parseTime(this.tableData[i].updated_at, '{y}-{m}-{d} {h}:{i}:{s}')
        }
        // this.tableData = [
        //   {
        //     name: '1',
        //     password: '2'
        //   },
        //   {
        //     name: '2',
        //     password: '3'
        //   }
        // ]
        this.listLoading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.checkedList = selection.map(item => item.name)
    },
    handleClose() {
      this.editLoading = false
    },
    handleAdd() {
      this.dialogAddVisible = true
      this.dataForm = {
        name: '',
        password: '',
        email: '',
        rolename: ''
      }
      this.dataForm.flag = 1
    },
    handleEdit(val) {
      this.dataForm.id = val.index
      this.dataForm.name = val.name
      this.dataForm.rolename = val.rolename
      this.dataForm.password = val.password
      this.dataForm.email = val.email
      this.dialogEditVisible = true
      this.dataForm.flag = 2
    },
    handleEditPassword(val) {
      this.passwordForm.name = val.name
      this.dialogEditPwdVisible = true
    },
    // 批量删除
    handleDelete: function(data) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (data.name) {
          const names = { 'name': data.name }
          handleDeleteUser(names).then(data != null ? this.reload() : '')
        } else {
          const names = this.checkedList
          handleDeleteUsers(names).then(data != null ? this.reload() : '')
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    // 编辑
    submitAddEditForm: function() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            this.dataForm.password = md5(this.dataForm.password)
            const params = Object.assign({}, this.dataForm)
            if (params.flag === 1) {
              // const datas = { 'name': 'tom', 'password': '123456', 'email': '23322@qq.com', 'rolename': 'user' }
              handleAddUser(params).then((res) => {
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
              handleEditUser(datas).then((res) => {
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
    submitEditPwdForm: function() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.passwordForm.password = md5(this.passwordForm.password)
            const params = Object.assign({}, this.passwordForm)
            const name = this.passwordForm.name
            const datas = { 'before': { 'name': name }, 'after': params }
            handleEditUser(datas).then((res) => {
              this.editLoading = false
              if (res.code === 204) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['passwordForm'].resetFields()
                this.reload()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.findPage(null)
            })
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
