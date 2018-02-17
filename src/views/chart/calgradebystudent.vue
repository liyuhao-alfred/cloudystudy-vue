<template>
    <Row>
        <Col :span="24">
        <chart :options="option" class="echarts"></chart>
        </Col>
    </Row>
</template>

<style scoped>
    .echarts {
        height: 500px;
        width: 100%;
        border-radius: 25px;
    }
</style>

<script>
    var expextAndRealityTitleArray = [];
    var everyCourseGradeArray = [];
    var expextAndRealityGradeArray = [];
    export default {
        data() {
            return {
                option: {
                    title: {
                        text: '学生成绩基础雷达图'
                    },
                    tooltip: {},
                    legend: {
                        data: expextAndRealityTitleArray,
                    },
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: everyCourseGradeArray,
                    },
                    series: [{
                        name: '预期 vs 现期',
                        type: 'radar',
                        data: expextAndRealityGradeArray
                    }]
                }
            }
        },
        beforeCreate() {
            expextAndRealityTitleArray = ['预期成绩', '实际成绩'];
            everyCourseGradeArray = [{
                name: '销售',
                max: 6500
            }, {
                name: '管理',
                max: 16000
            }, {
                name: '信息技术',
                max: 30000
            }, {
                name: '客服',
                max: 38000
            }, {
                name: '研发',
                max: 52000
            }, {
                name: '市场',
                max: 25000
            }];
            expextAndRealityGradeArray = [{
                value: [4300, 10000, 28000, 35000, 50000, 19000],
                name: '预期成绩'
            }, {
                value: [5000, 14000, 28000, 31000, 42000, 21000],
                name: '实际成绩'
            }];

            var everyCourseGradeArrayRec = this.$route.params.everyCourseGradeArray;
            if (everyCourseGradeArrayRec) {
                everyCourseGradeArray = everyCourseGradeArrayRec;
            }

            var expextAndRealityGradeArrayRec = this.$route.params.expextAndRealityGradeArray;
            if (expextAndRealityGradeArrayRec) {
                expextAndRealityGradeArray = expextAndRealityGradeArrayRec;
            }
        },
        methods: {},
    }
</script>