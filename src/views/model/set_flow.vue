<template>
  <div>
    <el-form ref="form" :label-position="labelPosition" label-width="130px" :rules="rules" :model="form">

      <el-form-item label="设置流程定义" prop="entity">
        <el-select v-model="form.flowDefinitionId">
          <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSave('form')" v-loading="editLoading">保存</el-button>
      <el-button @click="handleCancel()">取消</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        labelPosition:'left',
        editLoading:false,
        form: {},
        items: [],
        rules: {
          flowDefinitionId: [
            { required: true, message: '请输入需要设置的流程定义', trigger: 'blur' }
          ]
        },
      }
    },
    created : function(){
      const self = this;
      self.entity = self.$route.path.split("/")[1];
      const id = self.$route.params.id;
      self.id = id;
      if(id){
        self.$api.get('/flow/all', null,r=>{
          self.items = r.data;
          self.loading = false;
        });
      }

    },
    methods:{
      handleSave (form) {            // 确认添加提交
        const self = this;
        self.$refs[form].validate((valid)=> {
          if (valid) {
            this.editLoading = true;
            self.$api.post('/model/' + self.id + '/flow/' + self.form.flowDefinitionId, null, r => {
              this.$message({
                message: "设置成功！",
                type: 'success'
              });
              this.editLoading = false;
              this.$router.back();
            });
          }
        })
      },
      handleCancel(){    // 取消
        this.$router.back();
      },
      resetForm(form) {       // 重置
        this.$refs[form].resetFields();
      },
    }

  }
</script>
