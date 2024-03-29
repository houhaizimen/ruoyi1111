<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="实体索引" prop="idx">
        <el-input
          v-model="queryParams.idx"
          placeholder="请输入实体索引"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实体名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入实体名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型：山，神兽，植物等" clearable>
          <el-option
            v-for="dict in typeList"
            :key="dict.idx"
            :label="dict.idx + ' - ' + dict.name"
            :value="dict.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联皮影id" prop="shadowplay">
        <el-input
          v-model="queryParams.shadowplay"
          placeholder="请输入关联皮影id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="属性描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入属性描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:entity:add']"
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
          v-hasPermi="['system:entity:edit']"
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
          v-hasPermi="['system:entity:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:entity:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="entityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="实体id" align="center" prop="id" />
      <el-table-column label="实体索引" align="center" prop="idx" />
      <el-table-column label="实体名" align="center" prop="name" />
      <el-table-column label="类型：山，神兽，植物等" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.shadow_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="图片链接" align="center" prop="image" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="关联皮影编号" align="center" prop="shadowplay" />
      <el-table-column label="属性描述" align="center" prop="description" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:entity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:entity:remove']"
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

    <!-- 添加或修改图谱实体对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="实体索引" prop="idx">
          <el-input v-model="form.idx" placeholder="请输入实体索引" />
        </el-form-item>
        <el-form-item label="实体名" prop="name">
          <el-input v-model="form.name" placeholder="请输入实体名" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型:山，神兽，植物等">
            <el-option
              v-for="dict in typeList"
              :key="dict.idx"
              :label="dict.idx + ' - ' + dict.name"
              :value="dict.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片链接" prop="image">
          <image-upload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="关联皮影id" prop="shadowplay">
<!--          <el-input v-model="form.shadowplay" placeholder="请输入关联皮影id" />-->
          <el-select v-model="form.shadowplay" placeholder="请选择关联皮影">
            <el-option
              v-for="dict in shadowplayList"
              :key="dict.serialNo"
              :label="dict.serialNo + ' - ' + dict.name"
              :value="dict.serialNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入属性描述" />
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
import {listShadowplayList, listEntityType, listEntity, getEntity, delEntity, addEntity, updateEntity } from "@/api/system/entity";

export default {
  name: "Entity",
  dicts: ['shadow_type'],
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
      // 图谱实体表格数据
      entityList: [],
      // 实体类型列表
      typeList:[],
      //皮影列表
      shadowplayList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        idx: null,
        name: null,
        type: null,
        image: null,
        shadowplay: null,
        description: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "实体名不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询图谱实体列表 */
    getList() {
      this.loading = true;
      listEntity(this.queryParams).then(response => {
        this.entityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listEntityType(this.queryParams).then(response => {
        this.typeList = response.rows;
      });

      listShadowplayList(this.queryParams).then(response => {
        this.shadowplayList = response.rows;
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
        name: null,
        type: null,
        image: null,
        shadowplay: null,
        description: null,
        remark: null,
        createTime: null,
        updateTime: null
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
      this.title = "添加图谱实体";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEntity(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改图谱实体";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEntity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEntity(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除图谱实体编号为"' + ids + '"的数据项？').then(function() {
        return delEntity(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/entity/export', {
        ...this.queryParams
      }, `entity_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
