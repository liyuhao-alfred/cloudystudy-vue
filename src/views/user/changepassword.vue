<template>
    <div>
        <Row>
            <Col span="24">
            <div style="" class="doc-er">
                <Form ref="changepasswordForm" :model="changepasswordForm" :rules="changepasswordRule" inline>
                    <Form-item prop="account">
                        <Input type="text" v-model="changepasswordForm.account" placeholder="账号">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item prop="password">
                        <Input type="password" v-model="changepasswordForm.password" placeholder="密码">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="submit('changepasswordForm')">修改</Button>
                    </Form-item>
                </Form>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {api_ChangePassword} from 'api/user';
    import store from '@/store'

    export default {
        props: {
            row: Object
        },
        data() {
            return {
                changepasswordForm: {
                    account: store.getters.account,
                    password: ''
                },
                changepasswordRule: {
                    account: [{
                        required: true,
                        message: '请填写用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请填写密码',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 6,
                        message: '密码长度不能小于6位',
                        trigger: 'blur'
                    }]
                },
            }
        },
        methods: {
            submit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        return new Promise((resolve, reject) => {
                            api_ChangePassword(this.changepasswordForm.account, this.changepasswordForm.password).then(response => {
                                const code = response.code;
                                const data = response.data;
                                const message = response.message;

                                if (code == 0) {
                                    this.$Message.success(message);
                                    this.$router.push({
                                        path: '/',
                                    })
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
                    } else {
                        this.$Notice.error({
                            title: '操作提示',
                            desc: '表单验证失败!',
                            duration: 2
                        });
                    }
                })
            },
        }
    }
</script>