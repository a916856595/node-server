var path = require('path');
var mongodbHandler = require('./mongodbHandler.js');
var config = require(path.join(__dirname, '../config.js'));

var userHandler = {
  'login': login,
  'sign': sign,
  'checkUserName': checkUserName
};

function login(data) {
  return new Promise((resolve, reject) => {
    var dataModified = {
      'userName': data.userName
    };
    // mongodbHandler.findOne(dataModified, config.userDatabaseName, function (err, result) {
    //   if (err) {
    //     callback && callback('db error', undefined);
    //   } else if (result === null) {
    //     callback && callback(undefined, 'account is unlive');
    //   } else {
    //     if (result.password !== data.password) {
    //       callback && callback(undefined, 'password error');
    //     } else {
    //       callback && callback(undefined, 'success');
    //     }
    //   }
    // });
    mongodbHandler.findOne(dataModified, config.userDatabaseName).then(result => {
      if (result === null) {
        resolve(1); //用户不存在
      } else {
        if (result.password !== data.password) {
          resolve(2); // 密码错误
        } else {
          resolve(0); // 登录成功
        }
      }
    }, err => {
      reject(err);
    })
  });
}

function sign(data) {
  return new Promise((resolve, reject) => {
    var dataModified = {
      'userName': data.userName,
      'nickName': data.nickName,
      'password': data.password
    };
    mongodbHandler.insert(dataModified, config.userDatabaseName).then((result) => {
      resolve(result);
    }, (err) => {
      reject(err);
    });
  });
}

function checkUserName(data) {
  return new Promise((resolve, reject) => {
    var dataModified = {
      'userName': data.userName
    };
    mongodbHandler.findOne(dataModified, config.userDatabaseName).then((result) => {
      if (result === null) {
        resolve(1); //用户名可用
      } else {
        resolve(0); //用户名不可用
      }
    }, (err) => {
      reject(err);
    });
  });
}

module.exports = userHandler;