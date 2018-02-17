<template>
    <div>
        <Row>
            <Form ref="searchForm" :model="searchForm">
                <Form-item>
                    <Button type="primary" icon="refresh" @click="submit('searchForm')">提交</Button>
                </Form-item>
            </Form>
        </Row>

        <Row>
            <Col span="24">

            <Table ref="homeworkListAllTable" :loading="loading" size="small" stripe :data="tableData"
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
        <Row>
            <Modal title="上传文件" okText="关闭"
                   @on-ok="asyncOK" @on-cancel="asyncCancel" v-model="visible"
                   width="600">
                <uploadFileTemplate :upload-data-object="uploadFileData"></uploadFileTemplate>
            </Modal>
        </Row>
    </div>
</template>
<script>
    import {
        api_QueryAllHomework,
        api_EditLittleHomework,
        api_DeleteHomework,
        api_QueryAllHomeworkByCourse,
        api_QueryAllHomeworkByStudent
    } from '@/api/homework';
    import expandRow from './list-expand.vue';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';
    import uploadFileTemplate from '../file/dragadd';
    import store from '@/store';
    import {api_QueryAllCourse} from '@/api/course';
    import {api_QueryAllUser} from 'api/user';

    export default {
        components: {
            expandRow,
            uploadFileTemplate
        },
        data() {
            return {
                loading: true,
                visible: false,
                calenderOption: calenderOptionsDefault,
                pageDtoItem: pageDtoDefault,
                searchForm: {
                    dateRangement: [],
                    keyword: '',
                    courseId: [],
                    studentNo: [],
                    teacherNo: [],
                    pageDto: pageDtoDefault,
                },
                teacherList: [],
                teacherSearchForm: {
                    role: ['teacher']
                },
                courseList: [],
                courseSearchForm: {},
                studentList: [],
                studentSearchForm: {
                    role: ['student']
                },
                tableData: this.mockData(),
                uploadFileData: {
                    courseId: '3',
                    homeworkId: '3',
                    uploaderNo: ''
                },
                tableColumn: [{
                    type: 'selection',
                    width: 80,
                    align: 'center',
                    title: '编号',
                    key: 'id',
                }, {
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        const row = params.row;
                        const color = row.status === true ? 'green' : 'red';
                        const text = row.statusMemo;
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                }, {
                    title: '标题',
                    key: 'title',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].title);
                    }
                }, {
                    title: '课程名',
                    key: 'courseName',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].courseName);
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
                    width: 160,
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
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.uploadFile(params.index)
                                    }
                                }
                            }, '上传'),
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
            mockData() {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    var status = true;
                    if (Math.floor(Math.random() * 100 + 1) % 3 == 0) {
                        status = false;
                    }
                    data.push({
                        id: Math.floor(Math.random() * 100 + 1),
                        title: Math.floor(Math.random() * 100 + 1),
                        deadLine: Math.floor(Math.random() * 100 + 1),
                        content: Math.floor(Math.random() * 100 + 1),
                        courseId: Math.floor(Math.random() * 100 + 1),
                        courseName: Math.floor(Math.random() * 100 + 1),
                        teacherNo: Math.floor(Math.random() * 100 + 1),
                        teacherName: Math.floor(Math.random() * 100 + 1),
                        createTime: Math.floor(Math.random() * 7 + 1),
                        lastModifyTime: Math.floor(Math.random() * 7 + 1),
                        status: status,
                        statusMemo: Math.floor(Math.random() * 3 + 1),
                    })
                }
                return data;
            },
            asyncOK() {
                setTimeout(() => {
                    this.visible = false;
                }, 5000);
            },
            asyncCancel() {
                setTimeout(() => {
                    this.visible = false;
                }, 2000);
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
                contentInfo = contentInfo + `课程名：${this.tableData[index].courseName}<br>`;
                this.$Modal.info({
                    title: '作业信息',
                    content: contentInfo,
                })
            },
            uploadFile(index) {
                this.uploadFileData.courseId = ''
                this.uploadFileData.homeworkId = this.tableData[index].id
                this.uploadFileData.uploaderNo = store.getters.uid;
                this.visible = true;
            },
            remove(index) {
                return new Promise((resolve, reject) => {
                    api_DeleteHomework(this.tableData[index].id).then(response => {
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
                return new Promise((resolve, reject) => {
                    this.searchForm.pageDto = this.pageDtoItem;

                    api_QueryAllHomework(this.$refs[name].model).then(response => {
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
        },
        mounted() {
            const courseIdRec = this.$route.params.courseId;
            if (courseIdRec) {
                this.searchForm.courseId = []
                this.searchForm.courseId.push(courseIdRec);
            }

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