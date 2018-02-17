<template>
    <div>
        <Row>
            <Col span="16">
            <div style="" class="doc-er">
                <Form ref="addUserForm" :model="addUserForm" :rules="addUserRule"
                      :label-width="85">
                    <Form-item label="账号：" prop="account">
                        <Input type="text" v-model="addUserForm.account" placeholder="请输入学号"></Input>
                    </Form-item>
                    <Form-item label="学号：" prop="no">
                        <Input type="text" v-model="addUserForm.no" placeholder="请输入学号"></Input>
                    </Form-item>
                    <Form-item label="姓名：" prop="name">
                        <Input v-model="addUserForm.name" placeholder="请输入姓名"></Input>
                    </Form-item>
                    <Form-item label="电话：" prop="phone">
                        <Input type="text" v-model="addUserForm.phone" placeholder="请输入电话"></Input>
                    </Form-item>
                    <Form-item label="邮箱：" prop="email">
                        <Input type="text" v-model="addUserForm.email" placeholder="请输入邮箱"></Input>
                    </Form-item>
                    <Form-item label="注册时间：" prop="registTime">
                        <DatePicker type="date" :options="calenderOption" format="yyyy-MM-dd" placeholder="选择日期"
                                    v-model="addUserForm.registTime"></DatePicker>
                    </Form-item>
                    <Form-item label="出生日期：" prop="birthday">
                        <DatePicker type="date" :options="calenderOption" format="yyyy-MM-dd" placeholder="选择日期"
                                    v-model="addUserForm.birthday"></DatePicker>
                    </Form-item>
                    <Form-item label="性别：" prop="sex">
                        <Radio-group v-model="addUserForm.sex">
                            <Radio label="male">男</Radio>
                            <Radio label="female">女</Radio>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="身份：" prop="role">
                        <Checkbox-group v-model="addUserForm.role">
                            <Checkbox label="superadmin">超级管理员</Checkbox>
                            <Checkbox label="admin">管理员</Checkbox>
                            <Checkbox label="teacher">教师</Checkbox>
                            <Checkbox label="student">学生</Checkbox>
                        </Checkbox-group>
                    </Form-item>
                    <Form-item label="身份状态：" prop="status">
                        <iSwitch v-model="addUserForm.status" size="large">
                            <span slot="open">有效</span>
                            <span slot="close">无效</span>
                        </iSwitch>
                    </Form-item>
                    <Form-item label="介绍：" prop="description">
                        <Input v-model="addUserForm.description" type="textarea"
                               :autosize="{minRows: 2,maxRows: 100}" placeholder="请输入..."></Input>
                    </Form-item>
                    <Form-item>
                        <Button type="ghost" @click="reset('addUserForm')">重置</Button>
                        <Button type="ghost" @click="submit('addUserForm')">提交</Button>
                        <Button type="ghost" @click="historyBack()">取消</Button>
                    </Form-item>
                </Form>
            </div>
            </Col>
            <Col span="8">
            <div style="" class="doc-content">
                <tips :tipsModel="tipsObj"></tips>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import tips from './tips.vue';
    import {api_AddUser} from 'api/user';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';

    export default {
        components: {
            tips,
        },
        data() {
            return {
                tipsObj: {
                    name: 'alfred',
                },
                addUserForm: {
                    account: Math.floor(Math.random() * 1000000 + 100000) + '',
                    no: Math.floor(Math.random() * 1000000 + 100000) + '',
                    name: Math.floor(Math.random() * 1000000 + 100000) + '',
                    phone: Math.floor(Math.random() * 1000000 + 100000) + '',
                    email: Math.floor(Math.random() * 1000000 + 100000) + '@qq.com',
                    registTime: '2018-2-2',
                    birthday: '1486-9-05',
                    status: true,
                    sex: 'male',
                    role: ['teacher', 'student'],
                    description: Math.floor(Math.random() * 1000000 + 100000) + '请填写个人介绍信息，介绍不能少于10字...'
                },
                addUserRule: {
                    account: [{
                        required: true,
                        message: '请填写账号',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 6,
                        message: '长度不能小于6位',
                        trigger: 'blur'
                    },],
                    no: [{
                        required: true,
                        message: '请填写学号',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 6,
                        message: '长度不能小于6位',
                        trigger: 'blur'
                    },],
                    name: [{
                        required: true,
                        message: '姓名不能为空',
                        trigger: 'blur'
                    }],
                    phone: [{
                        required: true,
                        message: '请填写电话',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 6,
                        message: '长度不能小于6位',
                        trigger: 'blur'
                    },],
                    email: [{
                        required: true,
                        message: '邮箱不能为空',
                        trigger: 'blur'
                    }, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    sex: [{
                        required: true,
                        message: '请选择性别',
                        trigger: 'change'
                    }],
                    role: [{
                        required: true,
                        type: 'array',
                        min: 1,
                        message: '至少选择一个身份',
                        trigger: 'change'
                    }, {
                        type: 'array',
                        max: 2,
                        message: '最多选择两个身份',
                        trigger: 'change'
                    }],
                    registTime: [{
                        required: true,
                        type: 'date',
                        message: '请选择日期',
                        trigger: 'change'
                    }],
                    birthday: [{
                        required: true,
                        type: 'date',
                        message: '请选择日期',
                        trigger: 'change'
                    }],
                    description: [{
                        required: true,
                        message: '请输入个人介绍',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 10,
                        message: '介绍不能少于10字',
                        trigger: 'blur'
                    }]
                },
                calenderOption: calenderOptionsDefault,
            }
        }, //data
        methods: {
            submit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        return new Promise((resolve, reject) => {
                            api_AddUser(this.$refs[name].model).then(response => {
                                const code = response.code;
                                const data = response.data;
                                const message = response.message;

                                if (code == 0) {
                                    this.$Message.success(message);
                                    this.$router.push({
                                        path: '/user/list',
                                        name: '用户列表',
                                    })
                                } else {
                                    this.$Modal.error({
                                        title: message,
                                        content: data
                                    });
                                }
                                resolve(response);
                            }).catch(error => {
                                reject(error);
                            });
                        });
                    } else {
                        this.$Notice.error({
                            title: '操作提示',
                            desc: '表单验证失败!',
                            duration: 2
                        });
                    }
                })
            },
            reset(name) {
                this.$refs[name].resetFields();
            },
            historyBack() {
                this.$router.go(-1);
            }
        },
        watch: {
            'addUserForm.registTime': function (val) { //此处不要使用箭头函数
                var d = new Date(val);
                var youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            },
            'addUserForm.birthday': function (val) { //此处不要使用箭头函数
            },
        },
    }
</script>