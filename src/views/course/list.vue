<template>
    <div>
        <Row>
            <Form ref="searchForm" :model="searchForm" :label-width="85">
                <Row>
                    <Col span="12">
                    <Form-item label="教师：" prop="teacherNo">
                        <Select v-model="searchForm.teacherNo" filterable multiple>
                            <Option v-for="item in teacherList" :value="item.value" :key="item.value">
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
                </Row>
                <Row>
                    <Col span="8">
                    <Form-item label="关键字：" prop="keyword">
                        <Input v-model="searchForm.keyword" placeholder="请输入"></Input>
                    </Form-item>
                    </Col>
                    <Col span="8">
                    <Row>
                        <Form-item label="登记时间：" prop="dateRangement">
                            <DatePicker type="daterange" clearable @on-clear="clearDateRangement"
                                        :options="calenderOption" placement="bottom-end"
                                        placeholder="请输入登记日期"
                                        v-model="searchForm.dateRangement"></DatePicker>
                        </Form-item>
                    </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span="20">
                    <Form-item label="课时范围：" prop="count">
                        <Slider v-model="searchForm.count" range></Slider>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="20">
                    <Form-item label="人数范围：" prop="declareNum">
                        <Slider v-model="searchForm.declareNum" range></Slider>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                    <Form-item label="状态：">
                        <Radio-group v-model="searchForm.status">
                            <Radio label="on">进行中</Radio>
                            <Radio label="off">已结束</Radio>
                            <Radio label="all">所有</Radio>
                        </Radio-group>
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

            <Table ref="courseListAllTable" :loading="loading" size="small" stripe :data="tableData"
                   :columns="tableColum"></Table>

            <div style="margin: 10px;overflow: hidden">
                <div style="float: left;">
                    <Button type="primary" size="large" @click="exportData(1)">
                        <Icon type="ios-download-outline"></Icon>
                        导出数据
                    </Button>
                    <Button type="primary" size="large" @click="exportData(2)">
                        <Icon type="ios-download-outline"></Icon>
                        导出选中数据
                    </Button>
                    <Button type="primary" size="large" @click="exportData(3)">
                        <Icon type="ios-download-outline"></Icon>
                        自定义导出数据
                    </Button>
                </div>

                <div ref="pageDtoItem" :model="pageDtoItem" style="float: right;">
                    <Page :total="pageDtoItem.total" :current="pageDtoItem.current" show-sizer show-elevator show-total
                          @on-change="changeCurrentPage"
                          @on-page-size-change="changePageSize"></Page>
                </div>
            </div>

            </Col>
        </Row>
        <Row>
            <Modal title="部分数据修改" v-model="visible" width="600">
                <editlittleTemplate :course-edit-little-info-delever-object="courseEditLittleInfoFormItemObj"
                                    @onChildClick="onChildClickFunc">
                </editlittleTemplate>
                <div slot="footer"></div>
            </Modal>
        </Row>
    </div>
</template>
<script>
    import {
        api_CalAllGradeByCourse,
        api_CalAllGradeByStudent,
        api_QueryAllGrade,
    } from 'api/grade';
    import {api_DeleteCourse, api_QueryAllCourse, api_GetCourseByCourseId} from 'api/course';
    import expandRow from './list-expand.vue';
    import editlittleTemplate from '../course/editlittle';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';
    import {api_QueryAllUser, api_GetUserOption} from 'api/user';
    import store from '@/store';

    export default {
        components: {
            expandRow,
            editlittleTemplate
        },
        data() {
            return {
                loading: true,
                visible: false,
                calenderOption: calenderOptionsDefault,
                courseEditLittleInfoFormItemObj: {
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
                pageDtoItem: pageDtoDefault,
                teacherList: [],
                teacherSearchForm: {
                    role: ['teacher']
                },
                studentList: [],
                studentSearchForm: {
                    role: ['student']
                },
                searchForm: {
                    keyword: '',
                    status: '',
                    teacherNo: [],
                    studentNo: [],
                    dateRangement: [],
                    count: [20, 50],
                    declareNum: [20, 50],
                    pageDto: pageDtoDefault,
                },
                tableData: this.mockTableData(),
                tableColum: [{
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    title: '课程名',
                    key: 'name',
                    sortable: true
                }, {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.status === true ? 'green' : row.status === false ? 'red' : 'red';
                        const text = row.statusMemo;
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                }, {
                    title: '课时',
                    key: 'count',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].count);
                    }
                }, {
                    title: '预选人数',
                    key: 'decalreNum',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].declareNum);
                    }
                }, {
                    title: '已选人数',
                    key: 'acceptNum',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].acceptNum);
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
                                    marginRight: '5px',
                                    marginBottom: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.jumpCourseEditLittle(params.index)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    marginBottom: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            path: '/grade/listbycourse/' + (this.tableData[params.index].id)
                                        })
                                    }
                                }
                            }, '评分'),
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    marginBottom: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            path: '/homework/listbycourse/',
                                            name: '课程作业',
                                            params: {
                                                courseId: this.tableData[params.index].id
                                            }
                                        })
                                    }
                                }
                            }, '作业'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    marginBottom: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.calGradeByCourse(this.tableData[params.index].id)
                                    }
                                }
                            }, '统计'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                    marginBottom: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.removeCourse(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }],
                loading: false,
            }
        },
        methods: {
            calGradeByCourse(courseId) {
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
            clearDateRangement() {
                this.searchForm.dateRangement = []
            },
            mockTableData() {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    var status = true;
                    if (Math.floor(Math.random() * 100 + 1) % 3 == 0) {
                        status = false;
                    }
                    data.push({
                        id: Math.floor(Math.random() * 100 + 1),
                        teacherNo: 'Business' + Math.floor(Math.random() * 100 + 1),
                        name: 'Business' + Math.floor(Math.random() * 100 + 1),
                        createTime: Math.floor(Math.random() * 7 + 1),
                        lastModifyTime: Math.floor(Math.random() * 7 + 1),
                        beginTime: '1991-05-14',
                        endTime: '2061-05-14',
                        declareNum: Math.floor(Math.random() * 100 + 1),
                        acceptNum: Math.floor(Math.random() * 100 + 1),
                        count: Math.floor(Math.random() * 100 + 1),
                        status: status,
                        statusMemo: Math.floor(Math.random() * 3 + 1),
                        description: 'The Prestige',
                        teacher: {
                            name: Math.floor(Math.random() * 100 + 1),
                            no: Math.floor(Math.random() * 1000000 + 100000)
                        },
                    })
                }
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
            showDetail(index) {
                let contentInfo = ''
                contentInfo = contentInfo + `课程名：${this.tableData[index].name}<br>`;
                contentInfo = contentInfo + `课时：${this.tableData[index].count}<br>`;
                contentInfo = contentInfo + `已选人数：${this.tableData[index].acceptNum}<br>`;
                this.$Modal.info({
                    title: '课程信息',
                    content: contentInfo,
                })
            },
            jumpCourseEdit(index) {
                this.$router.push({
                    path: '/course/edit',
                    name: '课程修改',
                    params: {
                        courseEditInfoFormItem: this.tableData[index],
                        searchForm: this.searchForm
                    }
                })
            },
            jumpCourseEditLittle(index) {
                this.courseListCopyDataToEditTemplate(index);
                this.visible = true;
            },
            removeCourse(index) {
                return new Promise((resolve, reject) => {
                    api_DeleteCourse(this.tableData[index].id).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            this.$Message.info({
                                content: message,
                                duration: 2
                            });

                            this.tableData.splice(index, 1);
                            this.pageDtoItem.total = this.pageDtoItem.total - 1;
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
            getTeacherData() {
                return new Promise((resolve, reject) => {
                    api_GetUserOption(this.teacherSearchForm).then(response => {
                        const code = response.code;
                        const data = response.data;

                        if (code == 0) {
                            const content = data.content;
                            this.teacherList = []
                            for (let i = 0; i < content.length; i++) {
                                this.teacherList.push({
                                    value: content[i].no,
                                    label: content[i].name
                                })
                            }
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
            getStudentData() {
                return new Promise((resolve, reject) => {
                    api_GetUserOption(this.studentSearchForm).then(response => {
                        const code = response.code;
                        const data = response.data;

                        if (code == 0) {
                            const content = data.content;
                            this.studentList = []
                            for (let i = 0; i < content.length; i++) {
                                this.studentList.push({
                                    value: content[i].no,
                                    label: content[i].name
                                })
                            }
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
                return new Promise((resolve, reject) => {
                    this.searchForm.pageDto = this.pageDtoItem;

                    api_QueryAllCourse(this.$refs[name].model).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            const total = data.total;
                            const content = data.content;

                            this.tableData = content;
                            this.pageDtoItem.total = total;
                            this.$Notice.success({
                                title: '操作提示',
                                desc: message,
                                duration: 2
                            });

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
            reset(name) {
                this.$refs[name].resetFields();
            },
            onChildClickFunc(msg) {
                this.visible = false;
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.courseListAllTable.exportCsv({
                        filename: 'The original data'
                    });
                } else if (type === 2) {
                    this.$refs.courseListAllTable.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.courseListAllTable.exportCsv({
                        filename: 'Custom data',
                        columns: this.tableColum.filter((col, index) => index < 4),
                        data: this.tableData.filter((data, index) => index < 4)
                    });
                }
            },
            courseListCopyDataToEditTemplate(index) {
                return new Promise((resolve, reject) => {
                    api_GetCourseByCourseId(this.tableData[index].id).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            this.courseEditLittleInfoFormItemObj = data;

                            this.$Notice.success({
                                title: '操作提示',
                                desc: message,
                                duration: 2
                            });

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
            }
        },
        mounted() {
            const recCourseListInfoFormItem = this.$route.params.searchForm;
            if (recCourseListInfoFormItem) {
                this.searchForm = recCourseListInfoFormItem;
            }

            this.submit('searchForm');
            this.getTeacherData();
            this.getStudentData();
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