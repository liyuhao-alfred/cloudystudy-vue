<template>
    <div>
        <Row>
            <Col span="24">
            <div style="" class="doc-er">
                <Form ref="courseEditFormRef" :model="editCourseForm"
                      :rules="editCourseRule"
                      :label-width="85">
                    <Form-item label="课程名：" prop="name">
                        <Input v-model="editCourseForm.name" placeholder="请输入课程名"></Input>
                    </Form-item>
                    <Form-item label="课时：" prop="count">
                        <InputNumber :max="100" :min="24" v-model="editCourseForm.count"
                                     placeholder="请输入课时"></InputNumber>
                    </Form-item>
                    <Form-item label="可选人数：" prop="declareNum">
                        <InputNumber :max="300" :min="56" v-model="editCourseForm.declareNum"
                                     placeholder="请输入可选该课程的学生人数"></InputNumber>
                    </Form-item>
                    <Form-item label="授课时间：" prop="dateRangement">
                        <DatePicker type="daterange" clearable @on-clear="clearDateRangement" :options="calenderOption" placement="bottom-start"
                                    placeholder="请输入登记日期"
                                    v-model="editCourseForm.dateRangement"></DatePicker>
                    </Form-item>
                    <Form-item label="课程状态：" prop="status">
                        <iSwitch v-model="editCourseForm.status" size="large">
                            <span slot="open">有效</span>
                            <span slot="close">无效</span>
                        </iSwitch>
                    </Form-item>
                    <Form-item label="介绍：" prop="description">
                        <Input v-model="editCourseForm.description" type="textarea"
                               :autosize="{minRows: 2,maxRows: 100}" placeholder="请输入..."></Input>
                    </Form-item>
                    <Form-item>
                        <Button type="ghost" @click="cancel()">取消</Button>
                        <Button type="ghost"
                                @click="reset('courseEditFormRef')">重置
                        </Button>
                        <Button type="ghost"
                                @click="submit('courseEditFormRef')">
                            提交
                        </Button>
                    </Form-item>
                </Form>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import tips from '@/views/tips/tipsindex1';
    import {api_EditLittleCourse} from '@/api/course';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';
    import store from '@/store';

    export default {
        components: {
            tips,
        },
        props: {
            courseEditLittleInfoDeleverObject: {
                type: Object,
                required: true,
                default: this.editCourseForm
            },
        },
        data() {
            return {
                tipsObj: {
                    opType: '添加课程',
                    name: 'alfred',
                },
                editCourseForm: {
                    id: '',
                    name: '高数数学',
                    teacherNo: '',
                    count: 24,
                    declareNum: 86,
                    dateRangement: ['1486-9-05', '2018-2-2'],
                    status: true,
                    studyFileList: [],
                    description: '请填写课程介绍信息，介绍不能少于10字...'
                },
                editCourseRule: {
                    name: [{
                        required: true,
                        message: '课程名不能为空',
                        trigger: 'blur'
                    }],
                },
                calenderOption: calenderOptionsDefault,
            }
        },
        mounted() {
        },
        methods: {
            clearDateRangement() {
                this.editCourseForm.dateRangement = []
            },
            submit(name) {
                const teacherNo = store.getters.uid;
                if (!this.editCourseForm) {
                    this.editCourseForm.teacherNo = teacherNo
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        return new Promise((resolve, reject) => {
                            api_EditLittleCourse(this.$refs[name].model).then(response => {
                                const code = response.code;
                                const data = response.data;
                                const message = response.message;

                                if (code == 0) {
                                    this.$Modal.success({
                                        title: message,
                                        content: message
                                    });
                                } else {
                                    this.$Modal.error({
                                        title: message,
                                        content: data
                                    });
                                }
                                this.$emit('onChildClick', message);
                                resolve(response);
                            }).catch(error => {
                                reject(error);
                            });
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                        this.$emit('onChildClick', '表单验证失败!');
                    }
                })
            },
            reset(name) {
                this.$refs[name].resetFields();
            },
            cancel() {
                this.$emit('onChildClick', '操作成功');
            }
        },
        watch: {
            courseEditLittleInfoDeleverObject: {
                handler: function (val) {
                    this.editCourseForm = this.courseEditLittleInfoDeleverObject
                },
                deep: true//对象内部的属性监听，也叫深度监听
            },
        },
    }
</script>