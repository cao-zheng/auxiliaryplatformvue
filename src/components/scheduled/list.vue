<template>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column  prop="name" label="任务名称"></el-table-column>
            <el-table-column  prop="beanName" label="作用类名称"></el-table-column>
            <el-table-column  prop="methodName" label="方法名称"></el-table-column>
            <el-table-column  prop="methodParams" label="方法参数"></el-table-column>
            <el-table-column  prop="cronExpression" label="cron表达式"></el-table-column>
            <el-table-column  prop="jobStatus" label="状态"></el-table-column>
            <el-table-column  prop="remark" label="备注"></el-table-column>
            <el-table-column  prop="createTime" width="180" label="创建时间"></el-table-column>
            <el-table-column  prop="updateTime" width="180" label="更新时间"></el-table-column>
            <el-table-column fixed="right" width="180" >
                <template slot="header" stlye="align:center">
                    <el-button type="text" icon="el-icon-circle-plus-outline" @click="addClick()">新增</el-button>
                </template>
                <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-view" @click="viewClick(scope.row)">查看</el-button>
                    <el-button type="text" size="small" icon="el-icon-edit" @click="editClick(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" icon="el-icon-edit" @click="delClick(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框 -->
        <el-dialog  center title="定时任务"  :show-close="true" :visible.sync="sysJobConfigFormVisible" :destroy-on-close="true" :fullscreen="false">
            <scheduled-data :formData="formData" :disabled="disabled" :sysJobConfigFormVisible="sysJobConfigFormVisible" @formVisible="formVisible" @getList="getList"/>
        </el-dialog>
    </div>
</template>
<script>
import ScheduledData from './data.vue'
export default {
    name: 'ScheduledList',
    components:{
        'scheduled-data':ScheduledData
    },
    data: function() {
        return {
            tableData : null,//列表值
            sysJobConfigFormVisible:null,
            formData : null,//子组件详细值
            disabled : false
        }
    },
    mounted : function(){
        this.getList();
    },
    methods:{
        getList(){
            this.axios.get('/tasks').then(response=>{
                this.tableData = response.data
            })
            .catch(error=>{
                console.log(error);
            })
        },
        viewClick(row){ 
            this.formData = row//实际内容
            this.sysJobConfigFormVisible = true//弹框填写
            this.disabled = true;//表单不可编辑
        },
        editClick(row){
            this.formData = row
            this.sysJobConfigFormVisible = true//弹框填写
            this.disabled = false;
        },
        addClick(){
            this.formData = {
                jobId:"",
                jobStatus:1,//默认开启
                createTime:"0001-01-01 00:00:00",
                updateTime:"0001-01-01 00:00:00",
                name:"",
                beanName:"",
                methodName:"",
                methodParams:"",
                cronExpression:"",
                remark:""
            }
            this.sysJobConfigFormVisible = true;//弹框填写
            this.disabled = false;
        },
        delClick(row){
            
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.axios.delete('/task/'+row.jobId).then(response=>{
                    let data = response.data
                    if(data.code == 1){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList();
                    }
                }).catch(response=>{
                    console.log(response.data)
                 })
            }).catch(() => {      
            })
        },
        formVisible(data){
            this.sysJobConfigFormVisible = data
        }
    }
}
</script>