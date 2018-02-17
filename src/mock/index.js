import Mock from 'mockjs';
import mockDataUser from '@/mock/data/user';


// 登录相关
Mock.mock(/\/mocklogin\/loginbyaccount/, 'post', mockDataUser.mockFunc_loginByAccountAndPassword);
Mock.mock(/\/mocklogin\/logout/, 'post', mockDataUser.mockFunc_logout);
Mock.mock(/\/mockuser\/info\.*/, 'get', mockDataUser.mockFunc_getUserInfo);

export default Mock;
