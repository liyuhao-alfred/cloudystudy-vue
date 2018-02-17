import fetch from 'utils/fetch';

const url_Base = 'https://localhost:9680/cloudstudy/file';
const sys_DeleteFile = url_Base + '/delete';
const sys_DownloadFile = url_Base + '/download';
const sys_QueryAllFile = url_Base + '/list';
const sys_FindVideoFile = url_Base + '/single/';

export function api_DeleteFile(primaryKey) {
    const data = {
        'primaryKey': primaryKey,
    };

    return fetch({
        url: sys_DeleteFile,
        method: 'post',
        params: data
    });
}

/**
 * 下载文件
 */
export function api_DownLoadFile(primaryKey) {
    location.href = sys_DownloadFile + "?primaryKey=" + primaryKey
}

/**
 * 查找所有文件
 */
export function api_QueryAllFile(fileQueryObject) {
    return fetch({
        url: sys_QueryAllFile,
        method: 'post',
        data: fileQueryObject
    });
}

/**
 * 查找视频文件
 */
export function api_FindVideoFile(fileId) {
    return fetch({
        url: sys_FindVideoFile + fileId,
        method: 'post',
    });
}