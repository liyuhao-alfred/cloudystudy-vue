<template>
    <div>
        <Row>
            <Form ref="searchForm" :model="searchForm" :label-width="85">
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
                    <Col span="12">
                    <Form-item label="身份：" prop="role">
                        <Checkbox-group v-model="searchForm.role">
                            <Checkbox label="superadmin">超级管理员</Checkbox>
                            <Checkbox label="admin">管理员</Checkbox>
                            <Checkbox label="teacher">教师</Checkbox>
                            <Checkbox label="student">学生</Checkbox>
                        </Checkbox-group>
                    </Form-item>
                    </Col>
                    <Col span="12">
                    <Form-item label="状态：" prop="status">
                        <Radio-group v-model="searchForm.status" size="large">
                            <Radio label="on">在职/在读</Radio>
                            <Radio label="off">离职/肄业</Radio>
                            <Radio label="all">所有</Radio>
                        </Radio-group>
                    </Form-item>
                    </Col>
                </Row>
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
                    <Col span="12">
                    <Form-item>
                        <Button type="primary" @click="reset('searchForm')">重置</Button>
                        <Button type="primary" @click="submit('searchForm')">提交</Button>
                    </Form-item>
                    </Col>
                </Row>
            </Form>
        </Row>

        <Row>
            <Col span="24">

            <Table ref="tableRef" :loading="loading" size="small" stripe :data="tableData"
                   :columns="tableColumn"></Table>

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
    </div>
</template>
<script>
    import {api_DeleteUser, api_QueryAllUser} from 'api/user';
    import expandRow from './list-expand.vue';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';
    import {api_QueryAllCourse,api_GetCourseOption} from '@/api/course';

    export default {
        components: {
            expandRow
        },
        data() {
            return {
                loading: true,
                calenderOption: calenderOptionsDefault,
                pageDtoItem: pageDtoDefault,
                searchForm: {
                    keyword: '',
                    status: '',
                    role: [],
                    courseId: [],
                    dateRangement: [],
                    pageDto: pageDtoDefault,
                },
                courseList: [],
                courseSearchForm: {},
                tableData: this.mockData(),
                tableColumn: [{
                    type: 'selection',
                    width: 60,
                    align: 'center',
                }, {
                    title: '姓名',
                    key: 'name',
                    sortable: true
                }, {
                    title: '状态',
                    width: 130,
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
                    title: '权限',
                    key: 'role',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                title: '该用户拥有' + params.row.role.length + '种身份',
                                placement: 'bottom'
                            }
                        }, [
                            h('Tag', params.row.role.length),
                            h('div', {
                                slot: 'content'
                            }, [
                                h('ul', this.tableData[params.index].role.map(item => {
                                    return h('li', {
                                        style: {
                                            textAlign: 'center',
                                            padding: '4px'
                                        }
                                    }, item)
                                }))
                            ])
                        ]);
                    }
                }, {
                    title: '教学课程',
                    key: 'teachCourse',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                title: '该教师教学课程有' + params.row.teachCourse.length + '门',
                                placement: 'bottom'
                            }
                        }, [
                            h('Tag', params.row.teachCourse.length),
                            h('div', {
                                slot: 'content'
                            }, [
                                h('ul', this.tableData[params.index].teachCourse.map(item => {
                                    return h('li', {
                                        style: {
                                            textAlign: 'center',
                                            padding: '4px'
                                        }
                                    }, item.name + '：' + item.acceptNum + '个学生选修')
                                }))
                            ])
                        ]);
                    }
                }, {
                    title: '学习课程',
                    key: 'studyCourse',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                title: '该学生学习课程有' + params.row.studyCourse.length + '门',
                                placement: 'bottom'
                            }
                        }, [
                            h('Tag', params.row.studyCourse.length),
                            h('div', {
                                slot: 'content'
                            }, [
                                h('ul', this.tableData[params.index].studyCourse.map(item => {
                                    return h('li', {
                                        style: {
                                            textAlign: 'center',
                                            padding: '4px'
                                        }
                                    }, item.courseName + '：' + item.grade + '分')
                                }))
                            ])
                        ]);
                    }
                }, {
                    title: '证件号码',
                    key: 'no',
                    width: 200,
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].no);
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
                    width: 210,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
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
                                        this.showDetail(params.index)
                                    }
                                }
                            }, '详情'),
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
                                        this.jumpUserEdit(params.index)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
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
            getCourseData() {
                return new Promise((resolve, reject) => {
                    api_GetCourseOption(this.courseSearchForm).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            const content = data.content;
                            this.courseList = []
                            for (let i = 0; i < content.length; i++) {
                                this.courseList.push({
                                    value: content[i].id,
                                    label: content[i].name + '-' + content[i].teacher.name
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
            mockData() {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    var status = true;
                    if (Math.floor(Math.random() * 100 + 1) % 3 == 0) {
                        status = false;
                    }
                    data.push({
                        name: 'Business' + Math.floor(Math.random() * 100 + 1),
                        no: 'Business' + Math.floor(Math.random() * 100 + 1),
                        account: 'Business' + Math.floor(Math.random() * 100 + 1),
                        status: status,
                        statusMemo: Math.floor(Math.random() * 3 + 1),
                        role: ['City', 'People', 'Cost', 'Life', 'Entertainment'],
                        teachCourse: [{
                            name: Math.floor(Math.random() * 100 + 1),
                            acceptNum: Math.floor(Math.random() * 1000000 + 100000)
                        }, {
                            name: Math.floor(Math.random() * 100 + 1),
                            acceptNum: Math.floor(Math.random() * 1000000 + 100000)
                        }, {
                            name: Math.floor(Math.random() * 100 + 1),
                            acceptNum: Math.floor(Math.random() * 1000000 + 100000)
                        }],
                        studyCourse: [{
                            courseName: Math.floor(Math.random() * 100 + 1),
                            grade: Math.floor(Math.random() * 1000000 + 100000)
                        }, {
                            courseName: Math.floor(Math.random() * 100 + 1),
                            grade: Math.floor(Math.random() * 1000000 + 100000)
                        }, {
                            courseName: Math.floor(Math.random() * 100 + 1),
                            grade: Math.floor(Math.random() * 1000000 + 100000)
                        }],
                        phone: 'Data engineer',
                        email: 'badminton',
                        birthday: '1991-05-14',
                        sex: 'Steve Jobs',
                        age: 'The Prestige',
                        createTime: Math.floor(Math.random() * 7 + 1),
                        lastModifyTime: Math.floor(Math.random() * 7 + 1),
                        registTime: Math.floor(Math.random() * 7 + 1),
                        description: 'The Prestige',
                    })
                }
                return data;
            },
            clearDateRangement() {
                this.searchForm.dateRangement = []
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
                contentInfo = contentInfo + `姓名：${this.tableData[index].name}<br>`;
                contentInfo = contentInfo + `年龄：${this.tableData[index].age}<br>`;
                this.$Modal.info({
                    title: '用户信息',
                    content: contentInfo,
                })
            },
            jumpUserEdit(index) {
                this.$router.push({
                    path: '/user/edit',
                    name: '用户修改',
                    params: {
                        editUserForm: this.tableData[index],
                        searchForm: this.searchForm
                    }
                })
            },
            remove(index) {
                return new Promise((resolve, reject) => {
                    api_DeleteUser(this.tableData[index].no).then(response => {
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
            submit(name) {
                this.searchForm.pageDto = this.pageDtoItem;

                return new Promise((resolve, reject) => {
                    api_QueryAllUser(this.$refs[name].model).then(response => {
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
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                });
            },
            reset(name) {
                this.$refs[name].resetFields();
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.tableRef.exportCsv({
                        filename: 'The original data'
                    });
                } else if (type === 2) {
                    this.$refs.tableRef.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.tableRef.exportCsv({
                        filename: 'Custom data',
                        columns: this.tableColumn.filter((col, index) => index < 4),
                        data: this.tableData.filter((data, index) => index < 4)
                    });
                }
            },

        },
        mounted() {
            const recUserListInfoFormItem = this.$route.params.searchForm;
            if (recUserListInfoFormItem) {
                this.searchForm = recUserListInfoFormItem;
            }
            this.submit('searchForm');

            this.getCourseData();
        },
        watch: {
            'pageDtoItem.current': function (val) { //此处不要使用箭头函数
                this.searchForm.pageDto.current = val;
            },
            'pageDtoItem.size': function (val) { //此处不要使用箭头函数
                this.searchForm.pageDto.size = val;
            },
            'pageDtoItem.total': function (val) { //此处不要使用箭头函数
                this.searchForm.pageDto.total = val;
            },
        },
    }
</script>