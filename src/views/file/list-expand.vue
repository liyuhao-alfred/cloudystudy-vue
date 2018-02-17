<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">文件编号: </span>
            <span class="expand-value">{{ row.id }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">课程编号: </span>
            <span class="expand-value">{{ row.courseId }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">课程名: </span>
            <span class="expand-value">{{ row.courseName }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">教师编号: </span>
            <span class="expand-value">{{ row.teacherNo }}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">教师名: </span>
            <span class="expand-value">{{ row.teacherName }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">作业编号: </span>
            <span class="expand-value">{{ row.homeworkId }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">作业内容: </span>
            <span class="expand-value">{{ row.homeworkContent }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">文件截止: </span>
            <span class="expand-value">{{ row.homeworkDeadline }}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">上传者编号: </span>
            <span class="expand-value">{{ row.uploaderno }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">文上传者名字: </span>
            <span class="expand-value">{{ row.uploaderName }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">文件大小: </span>
            <span class="expand-value">{{ row.size }}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="24">
            <span class="expand-key">文件名: </span>
            <span class="expand-value">{{ row.name }}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="24">
            <span class="expand-key">文件路径: </span>
            <span class="expand-value">{{ row.path }}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="24">
            <span class="expand-key">文件备注: </span>
            <span class="expand-value">{{ row.memo }}</span>
            </Col>
        </Row>

        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">创建时间: </span>
            <span class="expand-value">{{ row.createTime }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">最后修改时间: </span>
            <span class="expand-value">{{ row.lastModifyTime }}</span>
            </Col>
        </Row>

    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
<style scoped>
    .expand-row {
        margin-bottom: 16px;
    }
</style>