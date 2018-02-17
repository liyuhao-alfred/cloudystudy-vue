import fetch from '@/utils/fetch';

const url_Base = 'https://localhost:9680/cloudstudy/teacher/course';
const sys_DeclareCourse = url_Base + '/declare';
const sys_DeleteCourse = url_Base + '/delete/';
const sys_EditCourse = url_Base + '/update';
const sys_QueryAllCourse = url_Base + '/list';
const sys_GetCourseOption = url_Base + '/option';
const sys_QueryAllCourseForStudent = url_Base + '/listForStudent';
const sys_QuerySingleCourse = url_Base + '/single/';
const sys_ChangeGrade = url_Base + '/changeGrade';

/**
 * 教师开课
 */
export function api_DeclareCourse(courseDeclareInfoObject) {
    return fetch({
        url: sys_DeclareCourse,
        method: 'post',
        data: courseDeclareInfoObject
    });
}

/**
 * 教师删除课程信息
 */
export function api_DeleteCourse(primaryKey) {
    const data = {
        'primaryKey': primaryKey,
    };

    return fetch({
        url: sys_DeleteCourse,
        method: 'post',
        params: data
    });
}

/**
 * 教师修改课程信息
 */
export function api_EditCourse(courseEditInfoObject) {
    return fetch({
        url: sys_EditCourse,
        method: 'post',
        data: courseEditInfoObject
    });
}

/**
 * 教师修改课程信息
 */
export function api_EditLittleCourse(courseEditInfoObject) {
    return fetch({
        url: sys_EditCourse,
        method: 'post',
        data: courseEditInfoObject
    });
}


/**
 * 查找所有课程
 */
export function api_QueryAllCourse(courseQueryObject) {
    return fetch({
        url: sys_QueryAllCourse,
        method: 'post',
        data: courseQueryObject
    });
}

/**
 * 查找所有课程
 */
export function api_GetCourseOption(courseQueryObject) {
    return fetch({
        url: sys_GetCourseOption,
        method: 'post',
        data: courseQueryObject
    });
}

/**
 * 查找所有课程
 */
export function api_QueryAllCourseForStudent(courseQueryObject) {
    return fetch({
        url: sys_QueryAllCourseForStudent,
        method: 'post',
        data: courseQueryObject
    });
}


/**
 * 查找单个课程
 */
export function api_GetCourseByCourseId(courseNo) {
    return fetch({
        url: sys_QuerySingleCourse + courseNo,
        method: 'post',
    });
}


export function api_ChangeGrade(gradePoint, gradeId) {
    const data = {
        'gradePoint': gradePoint,
        'gradeId': gradeId,
    };

    return fetch({
        url: sys_ChangeGrade,
        method: 'post',
        params: data
    });
}