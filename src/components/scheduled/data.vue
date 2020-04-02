<template>
    <el-tabs v-model="tabsDefault" type="card" @tab-click="handleClick">
        <el-tab-pane label="任务详情" name="first">
            <el-form :model="sysJobConfig" :rules="rules" ref="sysJobConfig" :label-width="formLabelWidth" :disabled="disabled">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="sysJobConfig.name"/>
                </el-form-item>
                <el-form-item label="作用类名称" prop="beanName">
                    <el-input v-model="sysJobConfig.beanName"/>
                </el-form-item>
                <el-form-item label="方法名称" prop="methodName">
                    <el-input v-model="sysJobConfig.methodName"/>
                </el-form-item>
                <el-form-item label="方法参数" prop="methodParams"> 
                    <el-input v-model="sysJobConfig.methodParams"  placeholder="多参数以分号;隔开(目前只支持string类型参数)"/>
                </el-form-item>
                <el-form-item label="cron表达式" prop="cronExpression">
                    <el-input v-model="sysJobConfig.cronExpression"/>
                </el-form-item>
                <el-form-item label="状态" prop="jobStatus">
                    <el-switch v-model="sysJobConfig.jobStatus"
                                :active-value="1"
                                :inactive-value="0"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="sysJobConfig.remark"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('sysJobConfig')">确定</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                    <el-button @click="formVisible()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="运行日志" name="second">
            <el-table :data="sysJobLog" border style="width: 100%">
                <el-table-column  prop="startTime" label="起始时间"></el-table-column>
                <el-table-column  prop="endTime" label="终止时间"></el-table-column>
                <el-table-column  prop="time" label="任务历时"></el-table-column>
                <el-table-column  prop="titleName" label="标题"></el-table-column>
                <el-table-column  prop="resultFlag" label="是否成功"></el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
let self;
let validateCron = (rule, value, callback) => {
    self.axios.get('/validate/cron?cronValue='+value).then((response)=>{
        if (response.data) callback();
        else callback(new Error('cron表达式不对，请重新输入'));
    }).catch((error)=>console.log(error))
};
export default {
    name:"ScheduledData",
    props:[
        "formData",
        "disabled",
        "sysJobConfigFormVisible",
    ],
    beforeCreate:function(){
        // 导入全局vueCompenent
       self = this;
    },
    watch:{//组件没有每次触发事件，通过watch监听子组件显示和隐藏模拟,immediate立即执行，不要等到第二次执行
        sysJobConfigFormVisible:{
            handler(newValue,oldValue){
                //深拷贝(防止数据污染,否则改子组件数据影响到父组件)
                Object.assign(this.sysJobConfig,self.formData)
                this.disabled = self.disabled
            },
            immediate:true
        }
    },
    data: function() {
        return {
            formLabelWidth:"120px",//表单样式
            tabsDefault:"first",
            sysJobConfig:{
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
            },
            sysJobLog:[{
                id:"",
                startTime:"",
                endTime:"",
                time:"",
                titleName:"",
                resultFlag:"",
                className:"",
                methodName:"",
                foreignId:""
            }],
            rules:{
                name:[
                    { required: true, message: '请输入定时任务名称', trigger: 'blur' }
                ],
                beanName:[
                    { required: true, message: '请输入定时任务所在类名称', trigger: 'blur' }
                ],
                methodName:[
                    { required: true, message: '请输入方法名称', trigger: 'blur' }
                ],
                cronExpression:[
                    { required : true, message: '请输入cron表达式', trigger: 'blur' },
                    { validator: validateCron,trigger: 'blur' }
                ],
                remark:[
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        submitForm(formName) {
            self.$refs[formName].validate((valid) => {
                if(valid){
                    self.axios({
                        url: '/task/save',
                        method: 'post',
                        data: this.sysJobConfig,
                        transformRequest: [data=>{
                            let ret = ''
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                        return ret
                         }],
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response=>{
                        let data = response.data
                        if(data.code == 1){
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            self.$emit("getList");
                            this.formVisible();
                        }else{
                            this.$message.error(data.data)
                        }
                    }).catch(response=>{
                         this.$message.error(response.data);
                    })
                }else{
                    return false;
                }
            })
        },
        resetForm(){
            Object.assign(this.sysJobConfig,self.formData)
        },
        formVisible(){//子组件传值给父组件
            self.$emit("formVisible",false);
        },
        handleClick(tab, event){
            self.axios.get("/logs/"+this.sysJobConfig.jobId).then((response)=>{
                self.sysJobLog = response.data
            }).catch(error=>{
                console.log(error);
            })
        }
    }
}
</script>