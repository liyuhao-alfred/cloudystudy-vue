import {
	param2Obj
}
from 'utils';

const userMap = {
	superadmin: {
		role: ['superadmin'],
		token: 'superadmin',
		no: '18814127430',
		account: '18814127430',
		password: '18814127430',
		salt: '18814127430',
		name: '18814127430',
		phone: '18814127430',
		email: '18814127430@qq.com',
		sex: '1',
		age: '1',
		birthday: '2000-1-26 14:31:30',
		introduction: '18814127430',
		create_time: '2017-1-26 14:31:30',
		last_modify_time: '2018-1-26 14:31:30',
		regist_time: '2000-5-26 14:31:30'
	},
	admin: {
		role: ['admin'],
		token: 'admin',
		no: '18814127431',
		account: '18814127431',
		password: '18814127431',
		salt: '18814127431',
		name: '18814127431',
		phone: '18814127431',
		email: '18814127431@qq.com',
		sex: '1',
		age: '1',
		birthday: '2000-1-26 14:31:31',
		introduction: '18814127431',
		create_time: '2017-1-26 14:31:31',
		last_modify_time: '2018-1-26 14:31:31',
		regist_time: '2000-5-26 14:31:31'
	},
	teacher: {
		role: ['teacher'],
		token: 'teacher',
		no: '18814127432',
		account: '18814127432',
		password: '18814127432',
		salt: '18814127432',
		name: '18814127432',
		phone: '18814127432',
		email: '18814127432@qq.com',
		sex: '1',
		age: '1',
		birthday: '2000-1-26 14:31:32',
		introduction: '18814127432',
		create_time: '2017-1-26 14:31:32',
		last_modify_time: '2018-1-26 14:31:32',
		regist_time: '2000-5-26 14:31:32'
	},
	student: {
		role: ['student'],
		token: 'student',
		no: '18814127433',
		account: '18814127433',
		password: '18814127433',
		salt: '18814127433',
		name: '18814127433',
		phone: '18814127433',
		email: '18814127433@qq.com',
		sex: '1',
		age: '1',
		birthday: '2000-1-26 14:31:33',
		introduction: '18814127433',
		create_time: '2017-1-26 14:31:33',
		last_modify_time: '2018-1-26 14:31:33',
		regist_time: '2000-5-26 14:31:33'
	}
}

export
default {
	mockFunc_loginByAccountAndPassword: config => {
		const {
			account
		} = JSON.parse(config.body);
		for (var key in userMap) {
			var tempMap = userMap[key];
			if (tempMap.account.indexOf(account) >= 0) {
				return tempMap;
			}
		}
	},
	mockFunc_getUserInfo: config => {
		const {
			token
		} = param2Obj(config.url);
		if (userMap[token]) {
			return userMap[token];
		} else {
			return Promise.reject('a');
		}
	},
	mockFunc_logout: () => 'success'
};