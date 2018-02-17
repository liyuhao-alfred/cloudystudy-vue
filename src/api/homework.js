import fetch from '@/utils/fetch';

const url_Base = 'https://localhost:9680/cloudstudy/homework';
const sys_DeclareHomework = url_Base + '/declare';
const sys_DeleteHomework = url_Base + '/delete/';
const sys_EditHomework = url_Base + '/update';
const sys_QueryAllHomework = url_Base + '/list';
const sys_GetHomeworkOption = url_Base + '/option';
const sys_QueryAllHomeworkByStudent = url_Base + '/listByStudent';
const sys_QueryAllHomeworkByCourse = url_Base + '/listByCourse';
const sys_QuerySingleHomework = url_Base + '/single/';

export function api_DeclareHomework(homeworkDeclareInfoObject) {
    return fetch({
        url: sys_DeclareHomework,
        method: 'post',
        data: homeworkDeclareInfoObject
    });
}

/**
 * 教师删除课程信息
 */
export function api_DeleteHomework(primaryKey) {
    const data = {
        'primaryKey': primaryKey,
    };

    return fetch({
        url: sys_DeleteHomework,
        method: 'post',
        params: data
    });
}


/**
 * 教师修改课程信息
 */
export function api_EditLittleHomework(homeworkEditInfoObject) {
    return fetch({
        url: sys_EditHomework,
        method: 'post',
        data: homeworkEditInfoObject
    });
}


/**
 * 查找所有课程
 */
export function api_QueryAllHomework(homeworkQueryObject) {
    return fetch({
        url: sys_QueryAllHomework,
        method: 'post',
        data: homeworkQueryObject
    });
}

/**
 * 查找所有课程
 */
export function api_GetHomeworkOption(homeworkQueryObject) {
    return fetch({
        url: sys_GetHomeworkOption,
        method: 'post',
        data: homeworkQueryObject
    });
}

/**
 * 查找所有课程
 */
export function api_QueryAllHomeworkByCourse(homeworkQueryObject) {
    return fetch({
        url: sys_QueryAllHomeworkByCourse,
        method: 'post',
        data: homeworkQueryObject
    });
}

/**
 * 查找所有课程
 */
export function api_QueryAllHomeworkByStudent(homeworkQueryObject) {
    return fetch({
        url: sys_QueryAllHomeworkByStudent,
        method: 'post',
        data: homeworkQueryObject
    });
}


/**
 * 查找单个课程
 */
export function api_GetHomeworkByHomeworkId(homeworkNo) {
    return fetch({
        url: sys_QuerySingleHomework + homeworkNo,
        method: 'post',
    });
}