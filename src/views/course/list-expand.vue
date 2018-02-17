<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">课程编号: </span>
            <span class="expand-value">{{ row.id }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">教师编号: </span>
            <span class="expand-value">{{ row.teacherNo }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">课程名: </span>
            <span class="expand-value">{{ row.name }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">创建时间: </span>
            <span class="expand-value">{{ row.createTime }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">修改时间: </span>
            <span class="expand-value">{{ row.lastModifyTime }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">开课时间: </span>
            <span class="expand-value">{{ row.beginTime }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">结课时间: </span>
            <span class="expand-value">{{ row.endTime }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">预选人数: </span>
            <span class="expand-value">{{ row.declareNum }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">已选人数: </span>
            <span class="expand-value">{{ row.acceptNum }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">课时: </span>
            <span class="expand-value">{{ row.count }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">备注: </span>
            <span class="expand-value">{{ row.description }}</span>
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