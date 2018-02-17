<template>
    <div>
        <Row>
            <Col span="16">
            <div style="" class="doc-er">
                <Form ref="declareHomeworkForm" :model="declareHomeworkForm"
                      :rules="declareHomeworkRule"
                      :label-width="85">
                    <Form-item label="课程名：" prop="courseId" placeholder="请选择课程">
                        <Select v-model="declareHomeworkForm.courseId" filterable>
                            <Option v-for="item in courseList" :value="item.value" :key="item.value">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </Form-item>

                    <Form-item label="作业题目：" prop="title">
                        <Input v-model="declareHomeworkForm.title" placeholder="请输入作业题目"></Input>
                    </Form-item>
                    <Form-item label="截止时间：" prop="deadLine">
                        <DatePicker type="date" :options="calenderOption" placement="bottom-start"
                                    placeholder="请输入截止时间"
                                    v-model="declareHomeworkForm.deadLine"></DatePicker>
                    </Form-item>
                    <Form-item label="课程状态：" prop="status">
                        <iSwitch v-model="declareHomeworkForm.status" size="large">
                            <span slot="open">有效</span>
                            <span slot="close">无效</span>
                        </iSwitch>
                    </Form-item>
                    <Form-item label="介绍：" prop="content">
                        <Input v-model="declareHomeworkForm.content" type="textarea"
                               :autosize="{minRows: 2,maxRows: 100}" placeholder="请输入..."></Input>
                    </Form-item>
                    <Form-item>
                        <Button type="ghost" @click="reset('declareHomeworkForm')">重置
                        </Button>
                        <Button type="ghost" @click="submit('declareHomeworkForm')">提交
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
    import {api_QueryAllCourse,api_GetCourseOption} from '@/api/course';
    import {api_DeclareHomework, api_QueryAllHomeworkByCourse} from '@/api/homework';
    import store from '@/store';
    import {calenderOptionDefault2, pageDtoDefault} from '@/utils/index';

    export default {
        components: {
            tips,
        },
        data() {
            return {
                tipsObj: {
                    opType: '添加作业',
                    name: 'alfred',
                },
                declareHomeworkForm: {
                    title: Math.floor(Math.random() * 1000000 + 100000) + '',
                    courseId: 1,
                    deadLine: '2015-11-25',
                    status: true,
                    content: Math.floor(Math.random() * 1000000 + 100000) + '请填写课程介绍信息，介绍不能少于10字...'
                },
                declareHomeworkRule: {
                    title: [{
                        required: true,
                        message: '课程名不能为空',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入介绍',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 10,
                        message: '介绍不能少于10字',
                        trigger: 'blur'
                    }]
                },
                courseSearchForm: {
                    keyword: '',
                    status: '',
                    dateRangement: [],
                    count: [20, 50],
                    declareNum: [20, 50],
                    pageDto: {
                        current: 1,
                        size: 10000,
                        total: 100,
                    },
                },
                courseList: [],
                calenderOption: calenderOptionDefault2,
            }
        },
        mounted() {
            this.getCourseData();
        },
        methods: {
            getCourseData() {
                return new Promise((resolve, reject) => {
                    api_GetCourseOption(this.courseSearchForm).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            const total = data.total;
                            const content = data.content;

                            this.courseList = []
                            for (let i = 0; i < content.length; i++) {
                                this.courseList.push({
                                    value: content[i].id,
                                    label: content[i].name + '-' + content[i].teacher.name
                                })
                            }
                            this.$Message.success(message);

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
            },

            submit(name) {
                const teacherNo = store.getters.uid;
                this.$refs[name].validate((valid) => {
                    if (valid && teacherNo) {
                        this.declareHomeworkForm.teacherNo = teacherNo;
                        return new Promise((resolve, reject) => {
                            api_DeclareHomework(this.$refs[name].model).then(response => {
                                const code = response.code;
                                const data = response.data;
                                const message = response.message;

                                if (code == 0) {
                                    this.$Message.success(message);
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
                        this.$Message.error('表单验证失败!');
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