<template>
    <navbar>
        <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
            &#9776;
        </button>
        <a class="navbar-brand"></a>
        <ul class="nav navbar-nav d-md-down-none">
            <li class="nav-item">
                <a class="nav-link navbar-toggler sidebar-toggler" @click="sidebarMinimize">&#9776;</a>
            </li>
        </ul>

        <ul class="nav navbar-nav d-md-down-none">
            <li class="nav-item header-item">
                <router-link tag="div" to='/' style="height:55px;" class="nav-link">
                    <p>
                        <Icon type="compose" size='30' color="#dddee1"></Icon>
                    </p>
                    <p style="color:white"> 主页管理 </p>
                </router-link>
            </li>
            <li class="nav-item header-item">
                <router-link tag="div" to='/home1' style="height:55px;" class="nav-link">
                    <p>
                        <Icon type="cube" size='30' color="#dddee1"></Icon>
                    </p>
                    <p style="color:white"> 系统介绍 </p>
                </router-link>
            </li>

            <li class="nav-item header-item">
                <router-link tag="div" to='/markdown' style="height:55px;" class="nav-link">
                    <p>
                        <Icon type="android-cloud" size='30' color="#dddee1"></Icon>
                    </p>
                    <p style="color:white"> markdown </p>
                </router-link>
            </li>

            <li class="nav-item header-item">
                <router-link tag="div" to='/tinymce' style="height:55px;" class="nav-link">
                    <p>
                        <Icon type="ios-bookmarks" size='30' color="#dddee1"></Icon>
                    </p>
                    <p style="color:white">tinymce </p>
                </router-link>
            </li>
        </ul>

        <ul class="nav navbar-nav ml-auto">
            <li class="nav-item d-md-down-none">
                <a class="nav-link">
                    <Icon type="android-notifications" size="20"></Icon>
                    <span class="badge badge-pill badge-danger">5</span></a>
            </li>

            <Dropdown class="nav-item">
                <a href="javascript:void(0)">
					<span slot="button">
                        <span class="d-md-down-none">{{showHead}}</span>
          				<img src="static/img/avatars/6.jpg" class="img-avatar" alt="o">
					</span>
                </a>
                <Dropdown-menu slot="list">
                    <Dropdown-item>
                        <p class="dropdown-itemp">
                            <Icon type="alert"></Icon>
                            待办事件<span class="badge badge-info">42</span></p>
                    </Dropdown-item>
                    <Dropdown-item>
                        <p class="dropdown-itemp">
                            <Icon type="chatbox-working"></Icon>
                            未读消息<span class="badge badge-success">42</span></p>
                    </Dropdown-item>
                    <Dropdown-item>
                        <p class="dropdown-itemp">
                            <Icon type="chatbox-working"></Icon>
                            未读消息<span class="badge badge-danger">42</span></p>
                    </Dropdown-item>
                    <Dropdown-item divided>
                        <p class="dropdown-itemp">
                            <Icon type="android-contact"></Icon>
                            个人信息
                        </p>
                    </Dropdown-item>
                    <Dropdown-item>
                        <router-link tag="div" to='/user/changepassword'>
                            <p class="dropdown-itemp">
                                <Icon type="android-settings"></Icon>
                                修改密码
                            </p>
                        </router-link>
                    </Dropdown-item>
                    <Dropdown-item>
                        <a href="" @click="Logout">
                            <p class="dropdown-itemp">
                                <Icon type="power"></Icon>
                                退出系统
                            </p>
                        </a>
                    </Dropdown-item>
                </Dropdown-menu>
            </Dropdown>

            <li class="nav-item d-md-down-none">
                <a class="nav-link navbar-toggler aside-menu-toggler" @click="asideToggle">&#9776;</a>
            </li>
        </ul>
    </navbar>
</template>
<script>
    import navbar from './Navbar'
    import store from '@/store';

    export default {
        name: 'header',
        components: {
            navbar,
        },
        data() {
            return {
                showHead: store.getters.name + '[' + store.getters.token + ']'
            }
        },
        mounted() {
            if (store.getters.token == 'superadmin') {
                this.showHead = store.getters.name + '[' + '超级管理员' + ']'
            } else if (store.getters.token == 'admin') {
                this.showHead = store.getters.name + '[' + '管理员' + ']'
            } else if (store.getters.token == 'teacher') {
                this.showHead = store.getters.name + '[' + '教师' + ']'
            } else if (store.getters.token == 'student') {
                this.showHead = store.getters.name + '[' + '学生' + ']'
            } else {
                this.showHead = store.getters.name + '[' + '黑客' + ']'
            }

        },
        methods: {
            Logout(e) {
                e.preventDefault();
                this.$store.dispatch('action_LogOut').then(() => {
                    this.$router.push({
                        path: '/login'
                    });
                }).catch(err => {
                    this.$message.error(err);
                });
            },
            click() {
                // do nothing
            },
            sidebarToggle(e) {
                e.preventDefault()
                document.body.classList.toggle('sidebar-hidden')
            },
            sidebarMinimize(e) {
                e.preventDefault()

                document.body.classList.toggle('sidebar-minimized')
            },
            mobileSidebarToggle(e) {
                e.preventDefault()

                document.body.classList.toggle('sidebar-mobile-show')
            },
            asideToggle(e) {
                e.preventDefault()
                document.body.classList.toggle('aside-menu-hidden')
            }
        }
    }
</script>

<style type="text/css" scoped>
    .dropdown-itemp {
        text-align: left;
        font-size: 15px;
        padding: 10px;
    }

    .header-item .ivu-dropdown-item {
        padding: 15px;
    }

    .header-item {
        width: 130px;
        height: 55px;
    }

    .header-item a {
        color: white !important;
    }
</style>