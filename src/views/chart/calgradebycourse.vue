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
    var studentNameArray = [];
    var gradeArray = [];
    var averageArray = [];
    export default {
        data() {
            return {
                option: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    legend: {
                        data: ['分数值', '平均分数']
                    },
                    xAxis: [{
                        type: 'category',
                        data: studentNameArray,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '分数值',
                        min: 0,
                        max: 100,
                        interval: 10,
                        axisLabel: {
                            formatter: '{value} 分'
                        }
                    }, {
                        type: 'value',
                        name: '评估值',
                        min: 0,
                        max: 100,
                        interval: 10,
                        axisLabel: {
                            formatter: '{value} 点'
                        }
                    }],
                    series: [{
                        name: '分数值',
                        type: 'bar',
                        data: gradeArray,
                    }, {
                        name: '平均分数',
                        type: 'line',
                        yAxisIndex: 1,
                        data: averageArray,
                    }]
                }
            }
        },
        beforeCreate() {
            studentNameArray = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            gradeArray = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 65.6, 65.2, 32.6, 20.0, 6.4, 3.3, 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 96.6, 85.2, 32.6, 20.0, 6.4, 3.3];
            averageArray = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2];

            var studentNameArrayRec = this.$route.params.studentNameArray;
            if (studentNameArrayRec) {
                studentNameArray = studentNameArrayRec
            }

            var gradeArrayRec = this.$route.params.gradeArray;
            if (gradeArrayRec) {
                gradeArray = gradeArrayRec
            }

            var averageArrayRec = this.$route.params.averageArray;
            if (averageArrayRec) {
                averageArray = averageArrayRec
            }
        },
        methods: {}
    }
</script>