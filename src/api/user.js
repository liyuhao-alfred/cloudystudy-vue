import fetch from 'utils/fetch';

const url_Base = 'https://localhost:9680/cloudstudy';
const sys_AddUser = url_Base + '/user/api/add';
const sys_DeleteUser = url_Base + '/user/delete/';
const sys_EditUser = url_Base + '/user/api/update';
const sys_QueryAllUser = url_Base + '/user/list';
const sys_GetUserOption = url_Base + '/user/option';
const sys_QuerySingleUser = url_Base + '/user/single/';
const sys_ChangePassword = url_Base + '/user/changepassword';


export function api_ChangePassword(account, password) {
    const data = {
        'account': account,
        'password': password
    };

    return fetch({
        url: sys_ChangePassword,
        method: 'post',
        params: data
    });
}

export function api_AddUser(userAddInfoObject) {
    return fetch({
        url: sys_AddUser,
        method: 'post',
        data: userAddInfoObject
    });
}

export function api_DeleteUser(userNo) {
    const data = {
        'no': userNo,
    };

    return fetch({
        url: sys_DeleteUser,
        method: 'post',
        params: data
    });
}

export function api_EditUser(userEditInfoObject) {
    return fetch({
        url: sys_EditUser,
        method: 'post',
        data: userEditInfoObject
    });
}

export function api_QueryAllUser(userQueryObject) {
    return fetch({
        url: sys_QueryAllUser,
        method: 'post',
        data: userQueryObject
    });
}

export function api_GetUserOption(userQueryObject) {
    return fetch({
        url: sys_GetUserOption,
        method: 'post',
        data: userQueryObject
    });
}

export function api_GetUserByUserNo(userNo) {
    return fetch({
        url: sys_QuerySingleUser + userNo,
        method: 'post',
    });
}
