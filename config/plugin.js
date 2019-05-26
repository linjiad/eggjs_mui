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
};

