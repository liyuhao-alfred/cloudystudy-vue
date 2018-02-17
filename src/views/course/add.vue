<template>
    <div>
        <Row>
            <Col span="16">
            <div style="" class="doc-er">
                <Form ref="addCourseForm" :model="addCourseForm"
                      :rules="addCourseRule"
                      :label-width="85">
                    <Form-item label="课程名：" prop="name">
                        <Input v-model="addCourseForm.name" placeholder="请输入课程名"></Input>
                    </Form-item>
                    <Form-item label="课时：" prop="count">
                        <InputNumber :max="100" :min="24" v-model="addCourseForm.count"
                                     placeholder="请输入课时"></InputNumber>
                    </Form-item>
                    <Form-item label="可选人数：" prop="declareNum">
                        <InputNumber :max="300" :min="56" v-model="addCourseForm.declareNum"
                                     placeholder="请输入可选该课程的学生人数"></InputNumber>
                    </Form-item>
                    <Form-item label="授课时间：" prop="dateRangement">
                        <DatePicker type="daterange" clearable @on-clear="clearDateRangement" :options="calenderOption" placement="bottom-start"
                                    placeholder="请输入登记日期"
                                    v-model="addCourseForm.dateRangement"></DatePicker>
                    </Form-item>
                    <Form-item label="课程状态：" prop="status">
                        <iSwitch v-model="addCourseForm.status" size="large">
                            <span slot="open">有效</span>
                            <span slot="close">无效</span>
                        </iSwitch>
                    </Form-item>
                    <Form-item label="介绍：" prop="description">
                        <Input v-model="addCourseForm.description" type="textarea"
                               :autosize="{minRows: 2,maxRows: 100}" placeholder="请输入..."></Input>
                    </Form-item>
                    <Form-item>
                        <Button type="ghost" @click="reset('addCourseForm')">重置
                        </Button>
                        <Button type="ghost" @click="submit('addCourseForm')">提交
                        </Button>
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
    import tips from '@/views/tips/tipsindex1';
    import {api_DeclareCourse} from '@/api/course';
    import store from '@/store';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';

    export default {
        components: {
            tips,
        },
        data() {
            return {
                tipsObj: {
                    opType: '添加课程',
                    name: 'alfred',
                },
                addCourseForm: {
                    name: Math.floor(Math.random() * 1000000 + 100000),
                    teacherNo: '',
                    count: Math.floor(Math.random() * 100),
                    declareNum: Math.floor(Math.random() * 100 + 100),
                    dateRangement: ['1486-9-05', '2018-2-2'],
                    status: true,
                    studyFileList: [],
                    description: Math.floor(Math.random() * 1000000 + 100000) + '请填写课程介绍信息，介绍不能少于10字...'
                },
                addCourseRule: {
                    name: [{
                        required: true,
                        message: '课程名不能为空',
                        trigger: 'blur'
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
        },
        methods: {
            clearDateRangement() {
                this.addCourseForm.dateRangement = []
            },
            submit(name) {
                const teacherNo = store.getters.uid;
                this.$refs[name].validate((valid) => {
                    if (valid && teacherNo) {
                        this.addCourseForm.teacherNo = teacherNo;
                        return new Promise((resolve, reject) => {
                            api_DeclareCourse(this.$refs[name].model).then(response => {
                                const code = response.code;
                                const data = response.data;
                                const message = response.message;


                                if (code == 0) {
                                    this.$Message.success(message);
                                    this.reset('addCourseForm')
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
        watch: {},
    }
</script>