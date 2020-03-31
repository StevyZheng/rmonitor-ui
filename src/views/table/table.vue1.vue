<template>
  <div class="app-container">
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <table align="center" width="300px">
        <tr>
          <th><el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox></th>
          <th><el-button type="primary" size="small" @click="handleAdd">新建</el-button></th>
          <th><el-button type="primary" size="small" @click="handleAdd">批量删除</el-button></th>
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" width="150">
        <template slot-scope="scope">
          {{ scope.row.password }}
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
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="修改时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updated }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="删除时间" width="200">
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
          <el-button type="primary" size="small">删除</el-button>
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
      :title="operation?'新增'：'编辑'"
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
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属租户" prop="rent" v-if="!operation">
          <el-input v-model="dataForm.roleName" auto-complete="off" />
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
import { getList } from '@/api/table'

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
  data() {
    return {
      tableData: [],
      checkAll: false,
      listLoading: true,
      operation:false,
      dialogVisible: false,
      dataForm: {
        id: 0,
        name: '',
        password: '',
        roleName: ''
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
      getList().then(response => {
        console.log(response.data)
        this.tableData = response.data
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
    handleCheckAllChange(val) {
      this.tableData.map((item, i) => {
        item.checked = val
      })
    },
    // 批量删除
    handleDelete: function (val) {
      this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
    },
    handleCheckItemChange(val)
    {for (let i = 0, l = this.tableData.length; i < l; i++) 
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
      this.operation = true
      this.dataForm = {
        id: 0,
        name:'tom',
        password:'123456',
        email:'23322@qq.com',
        rolename:'user'
      } 
    },
    // 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			let rolename = []
			for(let i=0,len=params.row.rolename.length; i<len; i++) {
				rolename.push(params.row.rolename[i].id)
			}
			this.dataForm.rolename = rolename
		},

   /* handleEdit(val) {
      this.dialogTitle = '修改'
      this.dataForm.id = val.index
      this.dataForm.username = val.username
      this.dataForm.password = val.password
      this.dataForm.rent = val.rent
      this.dialogVisible = true
    },
    submitForm() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
          })
        }
      })
    },*/
// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let rolename = []
						for(let i=0,len=params.rolename.length; i<len; i++) {
							let rolename = {
								
								roleId: params.userRoles[i]
							}
							userRoles.push(userRole)
						}
						params.userRoles = userRoles
						this.$api.user.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
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
  }
  } 
</script>
