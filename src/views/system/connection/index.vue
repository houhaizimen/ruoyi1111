<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="索引" prop="idx">
        <el-input
          v-model="queryParams.idx"
          placeholder="请输入索引"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="起始实体" prop="fromEntity">
        <el-input
          v-model="queryParams.fromEntity"
          placeholder="请输入起始实体"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="到达实体" prop="toEntity">
        <el-input
          v-model="queryParams.toEntity"
          placeholder="请输入到达实体"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关系id" prop="relationId">
        <el-select v-model="queryParams.relationId" placeholder="请选择关系id" clearable>
          <el-option
            v-for="dict in relationList"
            :key="dict.idx"
            :label="dict.idx + ' - ' + dict.name"
            :value="dict.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:connection:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:connection:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:connection:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:connection:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="connectionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="索引" align="center" prop="idx" />
      <el-table-column label="起始实体" align="center" prop="fromEntity" />
      <el-table-column label="到达实体" align="center" prop="toEntity" />
      <el-table-column label="关系id" align="center" prop="relationId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.shadow_relation" :value="scope.row.relationId"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:connection:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:connection:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改实体连接对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="索引" prop="idx">
          <el-input v-model="form.idx" placeholder="请输入索引" />
        </el-form-item>
        <el-form-item label="起始实体" prop="fromEntity">
          <el-input v-model="form.fromEntity" placeholder="请输入起始实体" />
        </el-form-item>
        <el-form-item label="到达实体" prop="toEntity">
          <el-input v-model="form.toEntity" placeholder="请输入到达实体" />
        </el-form-item>
        <el-form-item label="关系id" prop="relationId">
          <el-select v-model="form.relationId" placeholder="请选择关系id">
            <el-option
              v-for="dict in relationList"
              :key="dict.idx"
              :label="dict.idx  + ' - ' + dict.name"
              :value="dict.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listRelation, listConnection, getConnection, delConnection, addConnection, updateConnection } from "@/api/system/connection";

export default {
  name: "Connection",
  dicts: ['shadow_relation'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 实体连接表格数据
      connectionList: [],
      // 关系映射列表
      relationList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        idx: null,
        fromEntity: null,
        toEntity: null,
        relationId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        idx: [
          { required: true, message: "索引不能为空", trigger: "blur" }
        ],
        fromEntity: [
          { required: true, message: "起始实体不能为空", trigger: "blur" }
        ],
        toEntity: [
          { required: true, message: "到达实体不能为空", trigger: "blur" }
        ],
        relationId: [
          { required: true, message: "关系id不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询实体连接列表 */
    getList() {
      this.loading = true;
      listConnection(this.queryParams).then(response => {
        this.connectionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listRelation().then(response => {
        this.relationList = response.rows;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        idx: null,
        fromEntity: null,
        toEntity: null,
        relationId: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加实体连接";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConnection(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改实体连接";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateConnection(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConnection(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除实体连接编号为"' + ids + '"的数据项？').then(function() {
        return delConnection(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/connection/export', {
        ...this.queryParams
      }, `connection_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
