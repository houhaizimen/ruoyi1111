<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="实体ID" prop="entityId">
        <el-input
          v-model="queryParams.entityId"
          placeholder="请输入实体ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="章节id" prop="chapterId">
<!--        <el-input-->
<!--          v-model="queryParams.chapterId"-->
<!--          placeholder="请输入章节id"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
        <el-select v-model="queryParams.chapterId" placeholder="请选择--章节id" clearable filterable>
          <el-option
            v-for="item in chapterList"
            :key="item.chapterId"
            :label="item.chapreName + ' - ' + item.chapterId "
            :value="item.chapterId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入备注"
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
          v-hasPermi="['system:entity_chapter:add']"
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
          v-hasPermi="['system:entity_chapter:edit']"
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
          v-hasPermi="['system:entity_chapter:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:entity_chapter:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="entity_chapterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="实体ID" align="center" prop="entityId" />
      <el-table-column label="章节id" align="center" prop="chapterId" />
      <el-table-column label="备注" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:entity_chapter:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:entity_chapter:remove']"
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

    <!-- 添加或修改章节实体映射对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="实体ID" prop="entityId">
          <el-input v-model="form.entityId" placeholder="请输入实体ID" />
        </el-form-item>
        <el-form-item label="章节id" prop="chapterId">
<!--          <el-input v-model="form.chapterId" placeholder="请输入章节id" />-->
<!--          -->
          <el-select v-model="form.chapterId" placeholder="请选择-章节id" clearable filterable>
            <el-option
              v-for="item in chapterList"
              :key="item.chapterId"
              :label="item.chapreName + ' - ' + item.chapterId "
              :value="item.chapterId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入备注" />
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
import {
  listEntity_chapter,
  getEntity_chapter,
  delEntity_chapter,
  addEntity_chapter,
  updateEntity_chapter,
  list_chapterList
} from "@/api/system/entity_chapter";

export default {
  name: "Entity_chapter",
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
      // 章节实体映射表格数据
      entity_chapterList: [],
      //章节列表
      chapterList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        entityId: null,
        chapterId: null,
        description: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        entityId: [
          { required: true, message: "实体ID不能为空", trigger: "blur" }
        ],
        chapterId: [
          { required: true, message: "章节id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询章节实体映射列表 */
    getList() {
      this.loading = true;
      listEntity_chapter(this.queryParams).then(response => {
        this.entity_chapterList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

      list_chapterList(this.queryParams).then(response => {
        this.chapterList = response.rows;
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
        entityId: null,
        chapterId: null,
        createTime: null,
        updateTime: null,
        description: null
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
      this.title = "添加章节实体映射";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEntity_chapter(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改章节实体映射";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEntity_chapter(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEntity_chapter(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除章节实体映射编号为"' + ids + '"的数据项？').then(function() {
        return delEntity_chapter(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/entity_chapter/export', {
        ...this.queryParams
      }, `entity_chapter_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
