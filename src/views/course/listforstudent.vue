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
    </div>
</template>
<script>
    import {
        api_CalAllGradeByCourse,
        api_CalAllGradeByStudent,
        api_QueryAllGrade,
    } from 'api/grade';
    import {api_QueryAllCourseForStudent} from 'api/course';
    import {api_ChangeCommit} from 'api/grade';
    import expandRow from './list-expand.vue';
    import store from '@/store';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';

    export default {
        components: {
            expandRow,
        },
        data() {
            return {
                loading: true,
                visible: false,
                calenderOption: calenderOptionsDefault,
                pageDtoItem: pageDtoDefault,
                searchForm: {
                    keyword: '',
                    status: '',
                    studentNo: [],
                    dateRangement: [],
                    count: [0, 100],
                    declareNum: [0, 100],
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
                    key: 'isCommit',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.isCommit === true ? 'green' : 'red';
                        const text = row.isCommit === true ? '已选' : '可选';
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
                    width: 220,
                    align: 'center',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.isCommit === true ? 'error' : 'success';
                        const text = row.isCommit === true ? '不选' : '选择';

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
                                    type: color,
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.changeCommit(params.index)
                                    }
                                }
                            }, text),
                        ]);
                    }
                }],
                loading: false,
            }
        },
        methods: {
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
                        isCommit: status,
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
            changeCommit(index) {
                const studentNo = store.getters.uid;
                const courseId = this.tableData[index].id;
                return new Promise((resolve, reject) => {
                    api_ChangeCommit(studentNo, courseId).then(response => {
                        const code = response.code;
                        const data = response.data;
                        const message = response.message;

                        if (code == 0) {
                            this.$Message.info({
                                content: message,
                                duration: 2
                            });
                            this.submit('searchForm');

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

                    api_QueryAllCourseForStudent(this.$refs[name].model).then(response => {
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
        },
        mounted() {
            const recCourseListInfoFormItem = this.$route.params.searchForm;
            if (recCourseListInfoFormItem) {
                this.searchForm = recCourseListInfoFormItem;
            }

            this.searchForm.studentNo = []
            this.searchForm.studentNo.push(store.getters.uid)

            this.submit('searchForm');
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