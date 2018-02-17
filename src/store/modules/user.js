import {api_LoginByAccountAndPassword, api_Logout, api_GetUserInfo} from 'api/login';
import Cookies from 'js-cookie';

const user = {
    state: {
        user: '',
        status: '',
        account: Cookies.get('Admin-Account'),
        code: '',
        uid: undefined,
        auth_type: '',
        token: Cookies.get('Admin-Token'),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        },
        teacherList: [],
        studentList: [],
        userList: [],
        courseList: [],
        homeworkList: []
    },

    mutations: {
        SET_AUTH_TYPE: (state, type) => {
            state.auth_type = type;
        },
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_ACCOUNT: (state, account) => {
            state.account = account;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        LOGIN_SUCCESS: () => {
            console.log('login success')
        },
        LOGOUT_USER: state => {
            state.user = '';
        },
        SET_LIST_TEACHER: (state, teacherList) => {
            state.teacherList = teacherList;
        },
        SET_LIST_STUDENT: (state, studentList) => {
            state.studentList = studentList;
        },
        SET_LIST_USER: (state, userList) => {
            state.userList = userList;
        },
        SET_LIST_COURSE: (state, courseList) => {
            state.courseList = courseList;
        },
        SET_LIST_HOMEWORK: (state, homeworkList) => {
            state.homeworkList = homeworkList;
        },
    },

    actions: {
        // 邮箱登录
        action_LoginByAccountAndPassword({commit}, userInfo) {
            const account = userInfo.account.trim();
            return new Promise((resolve, reject) => {
                api_LoginByAccountAndPassword(account, userInfo.password).then(response => {
                    const data = response.data;
                    console.log(data);
                    Cookies.set('Admin-Token', data.token);
                    Cookies.set('Admin-Account', data.account);
                    commit('SET_TOKEN', data.token);
                    commit('SET_ACCOUNT', account);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 获取用户信息
        action_GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                api_GetUserInfo(state.account).then(response => {
                    const data = response.data;
                    commit('SET_ROLES', data.role);
                    commit('SET_NAME', data.name);
                    commit('SET_AVATAR', data.avatar);
                    commit('SET_UID', data.no);
                    commit('SET_INTRODUCTION', data.introduction);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 第三方验证登录
        action_LoginByThirdparty({commit, state}, code) {
            return new Promise((resolve, reject) => {
                commit('SET_CODE', code);
                loginByThirdparty(state.status, state.account, state.code, state.auth_type).then(response => {
                    const data = response.data;
                    commit('SET_TOKEN', data.token);
                    Cookies.set('Admin-Token', data.token);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 登出
        action_LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                api_Logout(state.account).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    Cookies.remove('Admin-Token');
                    Cookies.remove('Admin-Account');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        action_FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('Admin-Token');
                Cookies.remove('Admin-Account');
                alert("has logout");
                resolve();
            });
        },

        // 动态修改权限
        action_ChangeRole({commit}, role) {
            return new Promise(resolve => {
                commit('SET_ROLES', [role]);
                commit('SET_TOKEN', role);
                Cookies.set('Admin-Token', role);
                resolve();
            })
        },

        // 动态保存大数据量Select的Option项数据
        action_ChangeOptionData({commit, state}, type, listData) {
            return new Promise(resolve => {
                if (type == 1) {
                    commit('SET_LIST_TEACHER', listData);
                } else if (type == 2) {
                    commit('SET_LIST_STUDENT', listData);
                } else if (type == 3) {
                    commit('SET_LIST_USER', listData);
                } else if (type == 4) {
                    commit('SET_LIST_COURSE', listData);
                } else if (type == 5) {
                    commit('SET_LIST_HOMEWORK', listData);
                }
                resolve();
            })
        }
    }
};

export default user;
