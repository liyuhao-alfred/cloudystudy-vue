<template>
    <div>
        <Row>
            <Form ref="searchForm" :model="searchForm" :label-width="85">
                <Row>
                    <Col span="12">
                    <Form-item label="课程：" prop="courseId" placeholder="请选择课程">
                        <Select v-model="searchForm.courseId" filterable multiple>
                            <Option v-for="item in courseList" :value="item.value" :key="item.value">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                    <Form-item label="学生：" prop="studentNo">
                        <Select v-model="searchForm.studentNo" filterable multiple>
                            <Option v-for="item in studentList" :value="item.value" :key="item.value">
                                {{ item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    </Col>
                    <Col span="8">
                    <Form-item>
                        <Button type="primary" @click="reset('searchForm')">重置</Button>
                        <Button type="primary" icon="ios-search"
                                @click="submit('searchForm')">提交
                        </Button>
                    </Form-item>
                    </Col>
                </Row>
            </Form>
        </Row>

        <Row>
            <Col span="24">

            <Table ref="gradeListByCourse_Table" :loading="loading"
                   size="small" stripe
                   :data="tableData"
                   :columns="tableColumn"></Table>

            <div style="margin: 10px;overflow: hidden">
                <div ref="pageDtoItem" :model="pageDtoItem" style="float: right;">
                    <Page :total="pageDtoItem.total" :current="pageDtoItem.current" show-sizer show-elevator show-total
                          @on-change="changeCurrentPage"
                          @on-page-size-change="changePageSize"></Page>
                </div>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import store from '@/store';
    import {
        api_CalAllGradeByCourse,
        api_CalAllGradeByStudent,
        api_QueryAllGrade,
    } from 'api/grade';
    import {api_ChangeGrade, api_QueryAllCourse, api_GetCourseByCourseId} from 'api/course';
    import expandRow from './list-expand.vue';
    import {pageDtoDefault} from '@/utils/index';
    import {api_QueryAllUser} from 'api/user';

    export default {
        components: {
            expandRow,
        },
        data() {
            return {
                loading: false,
                visible: false,
                pageDtoItem: pageDtoDefault,
                searchForm: {
                    courseId: [],
                    studentNo: [],
                    pageDto: pageDtoDefault,
                },
                courseList: [],
                courseSearchForm: {},
                studentList: [],
                studentSearchForm: {
                    role: ['student']
                },
                tableData: this.mockData(),
                tableColumn: [{
                    title: '编号',
                    width: 80,
                    align: 'center',
                    key: 'id',
                }, {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.grade === 0 ? 'yellow' : 'green';
                        const text = row.grade === 0 ? '未评分' : '已评分';
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                }, {
                    title: '课程名',
                    key: 'courseName',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].courseName);
                    }
                }, {
                    title: '教师名',
                    key: 'teacherName',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].teacherName);
                    }
                }, {
                    title: '学生名',
                    key: 'studentName',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].studentName);
                    }
                }, {
                    title: '分数',
                    key: 'grade',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].grade);
                    }
                }, {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    width: 280,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showChangeGradeDialog(params.row)
                                    }
                                }
                            }, '评分'),
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.calGradeByCourse(params.row)
                                    }
                                }
                            }, '课程成绩统计'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.calGradeByStudent(params.row)
                                    }
                                }
                            }, '学生成绩统计'),
                        ]);
                    }
                }],
                gradePoint: '',
            }
        },
        methods: {
            mockData() {
                this.loading = true
                let data = [];
                for (let i = 0; i < 10; i++) {
                    var status = true;
                    if (Math.floor(Math.random() * 100 + 1) % 3 == 0) {
                        status = false;
                    }
                    data.push({
                        id: Math.floor(Math.random() * 100 + 1),
                        courseId: Math.floor(Math.random() * 100 + 1),
                        courseName: Math.floor(Math.random() * 100 + 1),
                        studentNo: Math.floor(Math.random() * 100 + 1),
                        studentName: Math.floor(Math.random() * 100 + 1),
                        grade: Math.floor(Math.random() * 100 + 1),
                        homeworkDeclareNum: Math.floor(Math.random() * 100 + 1),
                        homeworkAcceptNum: Math.floor(Math.random() * 100 + 1),
                        teacherNo: 'Business' + Math.floor(Math.random() * 100 + 1),
                        teacherName: 'Business' + Math.floor(Math.random() * 100 + 1),
                        createTime: Math.floor(Math.random() * 7 + 1),
                        lastModifyTime: Math.floor(Math.random() * 7 + 1),
                        status: status,
                    })
                }
                this.loading = false
                return data;
            },
            changeCurrentPage(current) {
                this.pageDtoItem.current = current;
                this.submit('searchForm');
            },
            changePageSize(size) {
                this.pageDtoItem.size = size;
                this.submit('searchForm');
            },
            showChangeGradeDialog(row) {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.gradePoint,
                                autofocus: true,
                                placeholder: '请输入分数...'
                            },
                            on: {
                                input: (val) => {
                                    this.gradePoint = val;
                                },
                            }
                        })
                    },
                    onOk: () => {
                        this.changeGrade(row)
                    }
                })
            },
            changeGrade(row) {
                const gradepoint = this.gradePoint;
                const gradeId = row.id
                return new Promise((resolve, reject) => {
                    api_ChangeGrade(gradepoint, gradeId).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            this.$Message.success(message);
                            this.submit('searchForm')
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
                this.loading = true
                return new Promise((resolve, reject) => {
                    this.searchForm.pageDto = this.pageDtoItem;

                    api_QueryAllGrade(this.$refs[name].model).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            const total = data.total;
                            const content = data.content;

                            this.tableData = content;
                            this.pageDtoItem.total = total;
                            this.$Message.success(message);
                        } else {
                            this.$Modal.error({
                                title: message,
                                content: data
                            });
                        }
                        this.loading = false
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                });
            },
            reset(name) {
                this.$refs[name].resetFields();
            },

            calGradeByCourse(row) {
                const courseId = row.courseId;
                return new Promise((resolve, reject) => {
                    api_CalAllGradeByCourse(courseId).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            const studentNameArray = data.studentNameArray;
                            const gradeArray = data.gradeArray;
                            const averageArray = data.averageArray;
                            this.$Message.success(message);
                            this.$router.push({
                                path: '/chart/calgradebycourse',
                                name: '课程成绩图',
                                params: {
                                    studentNameArray: studentNameArray,
                                    gradeArray: gradeArray,
                                    averageArray: averageArray,
                                }
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
            },
            calGradeByStudent(row) {
                const studentNo = row.studentNo
                return new Promise((resolve, reject) => {
                    api_CalAllGradeByStudent(studentNo).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            const everyCourseGradeArray = data.everyCourseGradeArray;
                            const expextAndRealityGradeArray = data.expextAndRealityGradeArray;
                            this.$Message.success(message);
                            this.$router.push({
                                path: '/chart/calgradebystudent',
                                name: '学生成绩图',
                                params: {
                                    everyCourseGradeArray: everyCourseGradeArray,
                                    expextAndRealityGradeArray: expextAndRealityGradeArray,
                                }
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
            },
        },
        mounted() {
            this.loading = true
            this.searchForm.courseId = []
            this.searchForm.studentNo = []
            let courseId = this.$route.params.id;
            if (courseId) {
                this.searchForm.courseId.push(courseId)
            }

            this.submit('searchForm');

            this.loading = false
        },
        watch: {
            pageDtoItem: {
                handler: function (val) {
                    this.searchForm.pageDto = val;
                },
                deep: true//对象内部的属性监听，也叫深度监听
            },
        },
    }
</script>