import fetch from '@/utils/fetch';

const url_Base = 'https://localhost:9680/cloudstudy/student/course';

const sys_QuerySingleGrade = url_Base + '/single/';
const sys_QueryAllGrade = url_Base + '/list';
const sys_ChangeCommit = url_Base + '/changeCommit/';
const sys_CalAllGradeByStudent = url_Base + '/calByStudent';
const sys_CalAllGradeByCourse = url_Base + '/calByCourse';

/**
 * 查找单个学生选中的课程
 */
export function api_GetGradeByGradeId(primaryKey) {
    return fetch({
        url: sys_QuerySingleGrade + primaryKey,
        method: 'post',
    });
}

export function api_QueryAllGrade(searchFormData) {
    return fetch({
        url: sys_QueryAllGrade,
        method: 'post',
        data: searchFormData
    });
}

export function api_ChangeCommit(studentNo, courseId) {
    const data = {
        'studentNo': studentNo,
        'courseId': courseId,
    };

    return fetch({
        url: sys_ChangeCommit,
        method: 'post',
        params: data
    });
}


export function api_CalAllGradeByStudent(studentNo) {
    const data = {
        'studentNo': studentNo,
    };
    return fetch({
        url: sys_CalAllGradeByStudent,
        method: 'post',
        params: data
    });
}

export function api_CalAllGradeByCourse(courseId) {
    const data = {
        'courseId': courseId,
    };
    return fetch({
        url: sys_CalAllGradeByCourse,
        method: 'post',
        params: data
    });
}