import fetch from 'utils/fetch';

const sys_LoginByAccountAndPassword = 'https://localhost:9680/login';
const sys_Logout = 'https://localhost:9680/logout';
const sys_GetUserInfo = 'https://localhost:9680/getUserInfo';

const mock_LoginByAccountAndPassword = '/mocklogin/loginbyaccount';
const mock_Logout = '/mocklogin/logout';
const mock_GetUserInfo = '/mockuser/info';

export function api_LoginByAccountAndPassword(account, password) {
    const data = {
        account,
        password
    };
    return fetch({
        url: sys_LoginByAccountAndPassword,
        mode: "cors",
        method: 'post',
        params: data
    });
}

export function api_Logout() {
    return fetch({
        url: sys_Logout,
        method: 'post'
    });
}

export function api_GetUserInfo(account) {
    return fetch({
        url: sys_GetUserInfo,
        method: 'get',
        params: {
            account
        }
    });
}