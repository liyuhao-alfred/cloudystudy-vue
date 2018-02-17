<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">课程编号: </span>
            <span class="expand-value">{{ row.courseId }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">课程名: </span>
            <span class="expand-value">{{ row.courseName }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">教师编号: </span>
            <span class="expand-value">{{ row.teacherNo }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">教师名: </span>
            <span class="expand-value">{{ row.teacherName }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">创建时间: </span>
            <span class="expand-value">{{ row.createTime }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">修改时间: </span>
            <span class="expand-value">{{ row.lastModifyTime }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">截止时间: </span>
            <span class="expand-value">{{ row.deadLine }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">内容: </span>
            <span class="expand-value">{{ row.content }}</span>
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