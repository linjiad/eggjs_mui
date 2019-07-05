'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // 使用ejs插件
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  // 利用mongoose连接mongo
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
};

