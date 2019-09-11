<template>
  <div>
    <el-form ref="form" :label-position="labelPosition" label-width="130px" :rules="rules" :model="form">

      <el-form-item label="授权给角色" prop="entity">
        <el-select v-model="form.roleId">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
        roles: [],
        rules: {
          roleId: [
            { required: true, message: '请输入需要授权的角色', trigger: 'blur' }
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
        self.$api.get('/role/all', null,r=>{
          console.log(r.data);
          if(r.code === 0){
            self.roles = r.data;
          }else{
            alert(r.message);
          }
          self.loading = false;
        },res=>{
          self.$router.push('/login');
        });
      }

    },
    methods:{
      handleSave (form) {            // 确认添加提交
        const self = this;
        self.$refs[form].validate((valid)=> {
          if (valid) {
            this.editLoading = true;
            self.$api.post('/role/' + self.form.roleId + '/authorization/' + self.entity + '/' + self.id, null, r => {
              if (r.code === 0) {
                this.$message({
                  message: "授权成功！",
                  type: 'success'
                });
                this.editLoading = false;
                this.$router.back();

              } else {
                alert(r.message);
                this.editLoading = false;
              }
            }, res => {
              this.$router.push({
                path: '/login',
              });
            });
          }else{

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
