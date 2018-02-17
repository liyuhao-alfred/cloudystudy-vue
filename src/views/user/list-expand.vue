<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">电话: </span>
            <span class="expand-value">{{ row.phone }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">邮箱: </span>
            <span class="expand-value">{{ row.email }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">生日: </span>
            <span class="expand-value">{{ row.birthday }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">年龄: </span>
            <span class="expand-value">{{ row.age }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">性别: </span>
            <span class="expand-value">{{ row.sex }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">记录创建时间: </span>
            <span class="expand-value">{{ row.createTime }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">记录修改时间: </span>
            <span class="expand-value">{{ row.lastModifyTime }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">个人描述: </span>
            <span class="expand-value">{{ row.description }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">证件号码: </span>
            <span class="expand-value">{{ row.no }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">注册时间: </span>
            <span class="expand-value">{{ row.registTime }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">家庭住址: </span>
            <span class="expand-value"></span>
            </Col>
            <Col span="12">
            <span class="expand-key">状态描述: </span>
            <span class="expand-value">{{ row.statusMemo }}</span>
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