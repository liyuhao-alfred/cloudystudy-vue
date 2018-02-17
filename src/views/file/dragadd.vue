<template>
    <div>
        <Row>
            <div>
                <Upload action='https://localhost:9680/cloudstudy/file/upload'
                        show-upload-list
                        name="file"
                        multiple
                        type="drag"
                        :format="['jpg','jpeg','gif','png','bmp','doc','docx','docm','xls','xlsx','xlsm','ppt','pptx','pptm','pdf','rtf','avi','wmv','mp4','mpeg','mov','mkv','flv','f4v','m4v','rmvb','rm','3gp','dat','ts','mts']"
                        :max-size="102400"
                        :data="uploadData"
                        :on-success="uploadSuccess"
                        :on-error="uploadError">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到这里上传</p>
                    </div>
                </Upload>

            </div>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            uploadDataObject: {
                type: Object,
                default: this.uploadData
            },
        },
        data() {
            return {
                uploadData: {
                    courseId: '',
                    homeworkId: '',
                    uploaderNo: ''
                },
                uploadDataHeaders: {
                    'ContentType': "application/json",
                    'Charset': "UTF-8",
                },
            }
        },
        mounted() {
        },
        methods: {
            uploadSuccess(response, file) {
                const code = response.code;
                const data = response.data;
                const message = response.message;
                if (code == 0) {
                    const id = data.id;
                    const path = data.path;
                    const name = data.name;
                    this.$Message.success(name + "上传成功！路径是：" + path);
                } else {
                    this.$Message.error(message);
                }
            },
            uploadError(response, file) {
                const code = response.code;
                const data = response.data;
                const message = response.message;

                this.$Message.error(message);
            },
        },
        watch: {
            uploadDataObject: {
                handler: function (val) {
                    this.uploadData = this.uploadDataObject
                },
                deep: true//对象内部的属性监听，也叫深度监听
            },
        },
    }
</script>