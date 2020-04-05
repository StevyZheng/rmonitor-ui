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
      <el-table-column align="center" label="角色名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述" width="150">
        <template slot-scope="scope">
          {{ scope.row.explain }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updated" label="修改时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="150" align="center">
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
        <el-form-item label="角色名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色描述" prop="email">
          <el-input v-model="dataForm.explain" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="dialogAddVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="submitForm">提交</el-button>
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
        <el-form-item label="角色名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色描述" prop="email">
          <el-input v-model="dataForm.explain" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="dialogEditVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { apiGetRoles, apiEditRole, apiAddRole, apiDeleteRole, apiDeleteRoles } from '@/api/user'
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
      dataForm: {
        name: '',
        explain: ''
      },
      rules: {
        name: [
          { required: true, type: 'string', message: '角色名不能为空', trigger: 'blur' }
        ],
        explain: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      editLoading: false,
      currentPage: 1,
      pageSize: 5,
      tmpRoleName: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      apiGetRoles().then(response => {
        if (response.data != null) {
          this.tableData = response.data
          for (let i = 0, len = response.data.length; i < len; i++) {
            response.data[i].id = i
            this.tableData[i].id = i
            this.tableData[i].updated_at = parseTime(this.tableData[i].updated_at, '{y}-{m}-{d} {h}:{i}:{s}')
          }
          this.listLoading = false
        } else {
          this.$message({ message: '操作失败, ' + response.msg, type: 'error' })
          this.listLoading = false
        }
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
      this.dataForm = { name: '', explain: '' }
      this.dataForm.flag = 1
    },
    handleEdit(val) {
      this.dataForm.id = val.index
      this.dataForm.name = val.name
      this.dataForm.explain = val.explain
      this.dialogEditVisible = true
      this.dataForm.flag = 2
      this.tmpRoleName = val.name
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
          apiDeleteRole(names).then(data != null ? this.reload() : '')
        } else {
          const names = this.checkedList
          apiDeleteRoles(names).then(data != null ? this.reload() : '')
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    submitForm: function() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.dataForm)
            // 添加
            if (params.flag === 1) {
              apiAddRole(params).then((res) => {
                this.editLoading = false
                if (res.code === 204) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.$refs['dataForm'].resetFields()
                  this.reload()
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.findPage(null)
              })
            }
            // 修改
            if (params.flag === 2) {
              const name = this.tmpRoleName
              const datas = { 'before': { 'name': name }, 'after': params }
              apiEditRole(datas).then((res) => {
                this.editLoading = false
                if (res.code === 204) {
                  this.$message({ message: '操作成功', type: 'success' })
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
  }
}
</script>
