<template>
  <div>
    <div class="top">
      <div class="title" style="margin-bottom: 20px">上传流程定义</div>
      <el-form :inline="true" ref="form" :model="form" :rules="rules">

        <el-form-item label="选择文件" prop="file">
          <div class="upload_file">
            <input type="file" name="file" id="file" ref="file" @change="uploadFile" />
            <input type="button" class="submit_style" size="small" value="浏览"/>
          </div>
          <div style="display: inline;" class="fileName" v-text="form.filename"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" :disabled="editLoading" @click="onSubmit('form')">上传</el-button>
          <div style="display: inline;">只能上传.zip文件，且不超过2MB</div>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <div v-for="item in dataArr" v-text="item" style="color: red;"></div>
      </el-form>
    </div>

  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        editLoading:false,
        form: {    // 上传参数
          file:'',
          filename:'',     // 文件名
        },
        rules: {
          file: [
            { required: true, message: '请选择文件', trigger: 'blur' }
          ],
        },
        dataArr:[]
      }
    },
    created(){

    },
    methods: {
      uploadFile(e){
        this.form.file = e.target.files[0];
        this.form.filename = e.target.files[0].name;
      },
      onSubmit(form) {
        const self = this;
        self.$refs['form'].validate((valid) => {
          if (valid) {
            if(this.form.file.size/1024/1024 <= 2) {      // 文件大小不能超过2MB
              this.editLoading = true;
              let formData = new FormData();
              formData.append("file", self.form.file);
              console.log(formData);
              self.$api.post('/flow/definition', formData, r => {
                self.dataArr = r.data;
                self.$refs[form].resetFields();
                document.getElementById('file').value = '';
                self.form.filename = '';
                this.editLoading = false;
              })
            }else{
              alert('上传文件不能超过2MB,请重新上传');
            }
          }
        })
      },
    }
  }
</script>
<style>
  .upload_file {
      display: inline-block;
      position: relative;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
  }
  .upload_file input[type=file] {
      position: absolute;
      left: 0;
      top: 0;
      bottom:0;
      right:0;
      width: 100%;
      opacity: 0;
      cursor: pointer;
  }
  .upload_file .submit_style {
      display: inline-block;
      width: 100%;
      text-align: center;
      font-family: "Microsoft yahei";
      background-color: #409eff;
      color: #FFF;
      text-decoration: none;
  }
  .submit_style{
      padding:8px 12px;
      border:none;
      background-color: #409eff;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      color: #fff;
  }
  .download{
      display: inline-block;
      padding: 8px 12px;
      border: none;
      background-color: #409eff;
      border-radius: 3px;
      color: #fff;
      font-size: 13px;
  }
</style>
