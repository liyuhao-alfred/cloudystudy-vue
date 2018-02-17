<template>
    <div>
        <Row>
            <Col span="24">
            <div style="" class="doc-content">
                <Card :model="tipsModel" style="margin-left: 20px;margin-right: 20px;">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        {{ tipsModel.opType }}提示:{{ tipsModel.name }}
                    </p>
                    <a href="#" slot="extra" @click.prevent="">
                        <Icon type="ios-loop-strong"></Icon>
                        换一换
                    </a>
                    <ul>
                        <li>
                            <p>1.提示内容 </p>
                        </li>
                        <li>
                            <p>2.提示内容 </p>
                        </li>
                    </ul>
                </Card>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            tipsModel: {
                type: Object,
                required: true,
                default: () => {
                    return {
                        opType: '添加用户',
                        name: 'alfred',
                    }
                },
            },
        },
    }
</script>