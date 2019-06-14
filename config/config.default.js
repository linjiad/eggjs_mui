/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1558845782465_6900';

  // add your middleware config here
  config.middleware = [];

  // 配置模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
      '.nj': 'nunjucks',
    },
  };
  exports.mongoose = {
    client: {
      url: 'mongodb://eggadmin:123456@localhost:27017/eggcms',
      options: {},
    },
  };

  // 配置session
  config.session = {
    key: 'SESSION_ID',
    maxAge: 864000, // 存储时间
    httpOnly: true, // 设置键值对是否可以被 js 访问，默认为 true，不允许被 js 访问。
    encrypt: true, // 设置是否对 Cookie 进行签名，如果设置为 true，则设置键值对的时候会同时对这个键值对的值进行签名，后面取的时候做校验，可以防止前端对这个值进行篡改。默认为 true。
    renew: true, // 延长会话有效期，每次刷新页面的时候session都会被延期（重新计算过期时间）
  };
  // 使用中间件
  config.middleware = [ 'adminauth' ];
  // 只有在访问/admin的时候才触发中间件
  config.adminauth = {
    match: '/admin',
  };
  // 上传白名单
  /* config.multipart = {
    whitelist: [ '.png' ], // 覆盖整个白名单，只允许上传 '.png' 格式
  };*/
  config.uploadDir = 'app/public/admin/upload'; // 上传图片的地址
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 配置表单数量
  exports.multipart = {
    fields: '50',
  };
  exports.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => {
        if (ctx.request.url === '/admin/goods/goodsUploadImage' || ctx.request.url === '/admin/goods/goodsUploadPhoto') {
          return true;
        }
        return false;
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
