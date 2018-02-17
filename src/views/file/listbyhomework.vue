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
                        <Form-item label="提交时间：" prop="dateRangement">
                            <DatePicker type="daterange" clearable @on-clear="clearDateRangement"
                                        :options="calenderOption" placement="bottom-end"
                                        placeholder="请输入提交日期"
                                        v-model="searchForm.dateRangement"></DatePicker>
                        </Form-item>
                    </Row>
                    </Col>
                    <Col span="8">
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
                   :columns="tableColum"></Table>

            <div style="margin: 10px;overflow: hidden">
                <div ref="pageDtoItem" :model="pageDtoItem" style="float: right;">
                    <Page :total="pageDtoItem.total" :current="pageDtoItem.current" show-sizer show-elevator show-total
                          @on-change="changeCurrentPage"
                          @on-page-size-change="changePageSize"></Page>
                </div>
            </div>

            </Col>
        </Row>
        <Modal title="图片预览" v-model="visible" :width="clientWidth">
            <img :src="imgSrc" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import {
        api_QueryAllHomework,
        api_GetHomeworkOption,
        api_EditLittleHomework,
        api_DeleteHomework,
        api_QueryAllHomeworkByCourse,
        api_QueryAllHomeworkByStudent
    } from '@/api/homework';
    import {
        api_AddFile,
        api_EditFile,
        api_QueryAllFile,
        api_DownLoadFile,
        api_DeleteFile
    } from 'api/file';
    import expandRow from './list-expand.vue';
    import {calenderOptionsDefault, pageDtoDefault} from '@/utils/index';
    import {api_QueryAllCourse,api_GetCourseOption} from '@/api/course';
    import {api_QueryAllUser,api_GetUserOption} from 'api/user';
    import store from '@/store';

    export default {
        components: {
            expandRow
        },
        data() {
            return {
                imgSrc: '',
                clientWidth: '1300',
                visible: false,
                loading: true,
                calenderOption: calenderOptionsDefault,
                pageDtoItem: pageDtoDefault,
                searchForm: {
                    fileSizeRangement: [],
                    dateRangement: [],
                    keyword: '',
                    userNo: [],
                    courseId: [],
                    homeworkId: [],
                    pageDto: pageDtoDefault,
                },
                userList: [],
                userSearchForm: {},
                courseList: [],
                courseSearchForm: {
                    teacherNo: [],
                },
                homeworkList: [],
                homeworkSearchForm: {},
                tableData: this.mockTableData(),
                tableColum: [{
                    title: '编号',
                    width: 80,
                    align: 'center',
                    key: 'id',
                }, {
                    title: '文件名',
                    key: 'name',
                    sortable: true
                }, {
                    title: '预览',
                    width: 80,
                    key: '文件',
                    sortable: true,
                    render: (h, params) => {
                        const row = params.row;
                        if (row.fileTypeName == 1) {//图片
                            return h('div', {
                                attrs: {
                                    'class': 'demo-upload-list',
                                },
                                on: {
                                    click: () => {
                                        this.showImg(params.index)
                                    }
                                }
                            }, [
                                h('Icon', {
                                    attrs: {
                                        'type': 'image',
                                        'size': '40',
                                    },
                                    props: {},
                                    style: {
                                        marginRight: '5px',
                                        width: '40px',
                                        height: '40px',
                                    },
                                }),
                            ]);
                        } else if (row.fileTypeName == 2) {//文档
                            return h('div', {
                                attrs: {
                                    'class': 'demo-upload-list',
                                },
                                on: {
                                    click: () => {
                                        this.showImg(params.index)
                                    }
                                }
                            }, [
                                h('Icon', {
                                    attrs: {
                                        'type': 'android-list',
                                        'size': '40',
                                    },
                                    props: {},
                                    style: {
                                        marginRight: '5px',
                                        width: '40px',
                                        height: '40px',
                                    },
                                }),
                            ]);
                        } else if (row.fileTypeName == 3) {//视频
                            return h('div', {
                                attrs: {
                                    'class': 'demo-upload-list',
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            path: '/file/videodetail/' + (row.id)
                                        })
                                    }
                                }
                            }, [
                                h('Icon', {
                                    attrs: {
                                        'type': 'social-youtube',
                                        'size': '40',
                                    },
                                    props: {},
                                    style: {
                                        marginRight: '5px',
                                        width: '40px',
                                        height: '40px',
                                    },
                                }),
                            ]);
                        } else {
                            return h('div', {
                                attrs: {
                                    'class': 'demo-upload-list',
                                },
                                on: {
                                    click: () => {
                                        this.showImg(params.index)
                                    }
                                }
                            }, [
                                h('Icon', {
                                    attrs: {
                                        'type': 'closed-captioning',
                                        'size': '40',
                                    },
                                    props: {},
                                    style: {
                                        marginRight: '5px',
                                        width: '40px',
                                        height: '40px',
                                    },
                                }),
                            ]);
                        }
                    }
                }, {
                    title: '类型',
                    key: 'type',
                    width: 80,
                    sortable: true,
                    render: (h, params) => {
                        return h('div', this.tableData[params.index].type);
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
                    width: 200,
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
                                        this.download(params.index)
                                    }
                                }
                            }, '下载'),
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
        mounted() {
            this.clientWidth = `${document.documentElement.clientWidth}`;
            this.clientWidth = Number(this.clientWidth) - 100
            // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
            window.onresize = function temp() {
                this.clientWidth = `${document.documentElement.clientWidth}`;
                this.clientWidth = Number(this.clientWidth) - 100
            };

            const fileListInfoFormItemRec = this.$route.params.searchForm;
            if (fileListInfoFormItemRec) {
                this.searchForm = fileListInfoFormItemRec;
            }

            const homeworkIdRec = this.$route.params.homeworkId;
            if (homeworkIdRec) {
                this.searchForm.homeworkId = []
                this.searchForm.homeworkId.push(homeworkIdRec)
            }

            if (this.searchForm.homeworkId.length == 0) {
                this.tableData = []
            } else {
                this.submit('searchForm')
            }

        },
        methods: {
            clearDateRangement() {
                this.searchForm.dateRangement = []
            },
            mockTableData() {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    var fileTypeName = 0;
                    if (Math.floor(Math.random() * 100 + 1) % 3 == 0) {
                        fileTypeName = 2;
                    } else if (Math.floor(Math.random() * 100 + 1) % 5 == 0) {
                        fileTypeName = 3;
                    } else if (Math.floor(Math.random() * 100 + 1) % 2 == 0) {
                        fileTypeName = 1;
                    }
                    data.push({
                        id: Math.floor(Math.random() * 100 + 1),
                        courseId: Math.floor(Math.random() * 100 + 1),
                        courseName: Math.floor(Math.random() * 100 + 1),
                        teacherNo: Math.floor(Math.random() * 100 + 1),
                        teacherName: Math.floor(Math.random() * 100 + 1),
                        homeworkId: Math.floor(Math.random() * 100 + 1),
                        homeworkTitle: Math.floor(Math.random() * 100 + 1),
                        homeworkContent: Math.floor(Math.random() * 100 + 1),
                        homeworkDeadline: Math.floor(Math.random() * 100 + 1),
                        uploaderno: Math.floor(Math.random() * 100 + 1),
                        uploaderName: Math.floor(Math.random() * 100 + 1),
                        name: 'Business' + Math.floor(Math.random() * 100 + 1),
                        path: '1991-05-14',
                        src: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar',
                        type: Math.floor(Math.random() * 7 + 1),
                        fileTypeName: fileTypeName,
                        size: 'Data engineer',
                        createTime: Math.floor(Math.random() * 7 + 1),
                        lastModifyTime: Math.floor(Math.random() * 7 + 1),
                        memo: 'badminton',
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
                this.$Modal.info({
                    title: 'File Info',
                    content: `文件名：${this.tableData[index].name}<br>`
                })
            },
            download(index) {
                return new Promise((resolve, reject) => {
                    api_DownLoadFile(this.tableData[index].id)
                });
            },
            remove(index) {
                return new Promise((resolve, reject) => {
                    api_DeleteFile(this.tableData[index].id).then(response => {
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
                        columns: this.tableColum.filter((col, index) => index < 4),
                        data: this.tableData.filter((data, index) => index < 4)
                    });
                }
            },
            submit(name) {
                this.searchForm.pageDto = this.pageDtoItem;
                return new Promise((resolve, reject) => {
                    api_QueryAllFile(this.$refs[name].model).then(response => {
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
            showImg(index) {
                this.imgSrc = this.tableData[index].src;
                this.visible = true;
            },
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