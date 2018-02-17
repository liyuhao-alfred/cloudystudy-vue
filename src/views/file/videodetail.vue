<template>
    <div class="animated fadeIn" style="margin-top:50px;">
        <Row>
            <Col span="18">
            <div style="text-align:center">
                <video controls height="300" v-if="is_video" id='video' preload="auto"
                       :src="videoInfo.src">
                </video>
            </div>
            </Col>
            <Col span="6">
            <Card>
                <div v-if="is_video">
                    <p slot="title">视频名称:{{videoInfo.name}}</p>
                    <p>上传时间:{{videoInfo.createTime}}</p>
                    <p>视频长度:{{videoExtendInfo.duration}}</p>
                    <p>文件大小: {{videoInfo.size}}</p>
                    <p>识别结果</p>
                    <i-circle :size="100" :trail-width="4" :stroke-width="5"
                              :percent="videoExtendInfo.teachPercent"
                              stroke-linecap="square" stroke-color="#ff9900">
                        <div class="demo-i-circle-custom">
                            <h1>{{videoExtendInfo.teachCount}}</h1>
                            <p>教学镜头数</p>
                            <span>总占比<i>{{videoExtendInfo.teachPercent+"%"}}</i></span>
                        </div>
                    </i-circle>
                    <i-circle :size="100" :trail-width="4" :stroke-width="5"
                              :percent="videoExtendInfo.pornPercent"
                              stroke-linecap="square" stroke-color="#ed3f14">
                        <div class="demo-i-circle-custom">
                            <h1>{{videoExtendInfo.pornCount}}</h1>
                            <p>不宜镜头数</p>
                            <span>总占比<i>{{videoExtendInfo.pornPercent+"%"}}</i></span>
                        </div>
                    </i-circle>
                </div>
            </Card>
            </Col>
        </Row>

        <Row v-if="is_video">
            <Col span="24">
            <Table border :columns="columns6" :data="video_result"></Table>
            <Page :total="this.video_result.length" show-total
                  style="text-align:right;margin-top:50px"></Page>
            </Col>
        </Row>

    </div>
</template>

<script>
    import {api_FindVideoFile} from 'api/file';

    export default {
        data() {
            return {
                videoInfo: {
                    courseId: '',
                    homeworkId: '',
                    name: 'p.video',
                    src: 'http://otl6ypoog.bkt.clouddn.com/Objectstoarge/videos/2017-08-14/65055_WeChatSight38.mp4',
                    path: '',
                    type: '',
                    size: '1M',
                    createTime: '2017-08-10 17:03:54',
                    lastModifyTime: '',
                    memo: '',
                    file: '',
                },
                videoExtendInfo: {
                    duration: '11s',
                    teachPercent: 60,
                    teachCount: 500,
                    pornPercent: 10,
                    pornCount: 100,
                },
                is_video: true,
                video_result: this.mockVideoInfo(),
                columns6: [{
                    title: '级别',
                    key: 'level',
                    render: (h, params) => {
                        let level = '';
                        if (params.row.level === 0)
                            level = "标记镜头";
                        else if (params.row.level === 1)
                            level = "跳过镜头";
                        return h('div', [
                            h('strong', level)
                        ]);
                    },
                    filters: [{
                        label: '标记镜头',
                        value: 1
                    }, {
                        label: '跳过镜头',
                        value: 2
                    }],
                    filterMultiple: false,
                    filterMethod(value, row) {
                        if (value === 1) {
                            return row.level === 0;
                        } else if (value === 2) {
                            return row.level === 1;
                        }
                    }
                }, {
                    title: '出现时刻',
                    render: (h, params) => {
                        return h('div', [
                            h('strong', {
                                style: {
                                    color: "#dddee1",
                                    cursor: "pointer",
                                },
                            }, params.row.time)
                        ]);
                    },
                }, {
                    title: '持续时间',
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.duration)
                        ]);
                    },
                }, {
                    title: "置信度",
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.confidence)
                        ]);
                    },
                    filters: [{
                        label: '大于0.90',
                        value: 1
                    }, {
                        label: '小于0.90',
                        value: 2
                    }],
                    filterMultiple: false,
                    filterMethod(value, row) {
                        if (value === 1) {
                            return row.confidence >= 0.90;
                        } else if (value === 2) {
                            return row.confidence < 0.90;
                        }
                    }
                }],
            }
        },
        created() {
        },
        mounted() {
            var fileId = this.$route.params.id;

            return new Promise((resolve, reject) => {
                api_FindVideoFile(fileId).then(response => {
                    const code = response.code;
                    const data = response.data;
                    const message = response.message;

                    if (code == 0) {
                        this.videoInfo = data;
                        this.$Message.success(message);
                    }
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        methods: {
            mockVideoInfo() {
                let data = [];
                for (let i = 0; i < 7; i++) {
                    var fileTypeName = 0;
                    if (Math.floor(Math.random() * 100 + 1) % 3 == 0) {
                        fileTypeName = 2;
                    } else if (Math.floor(Math.random() * 100 + 1) % 5 == 0) {
                        fileTypeName = 3;
                    } else if (Math.floor(Math.random() * 100 + 1) % 2 == 0) {
                        fileTypeName = 1;
                    }
                    data.push({
                        level: 0,
                        time: i + 2,
                        duration: Math.floor(Math.random() * 100 + 1) + "s",
                        confidence: Math.floor(Math.random() * 100 + 1),
                    })
                }
                return data;
            },
        },
    }
</script>

<style type="text/css">
    .demo-i-circle-custom h1 {
        color: #3f414d;
        font-size: 10px;
        font-weight: normal;
    }

    .demo-i-circle-custom p {
        color: #657180;
        font-size: 8px;
        margin: 5px 0 2px;
    }

    .demo-i-circle-custom span {
        display: block;
        padding-top: 15px;
        color: #657180;
        font-size: 10px;
    }

    .demo-i-circle-custom span :before {
        content: '';
        display: block;
        width: 50px;
        height: 1px;
        margin: 0 auto;
        background: #e0e3e6;
        position: relative;
        top: -20px;
    }

    .demo-i-circle-custom span i {
        font-style: normal;
        color: #3f414d;
    }
</style>