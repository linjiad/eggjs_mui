'use strict';

const svgCaptcha = require('svg-captcha'); // 引入验证

const Service = require('egg').Service;
// md5加密
const md5 = require('md5');


class ToolsService extends Service {

  // 生成验证码
  async captcha() {

    const captcha = svgCaptcha.create({
      size: 6,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966',
    });
    console.log(captcha.text);
    this.ctx.session.code = captcha.text; /* 验证码上面的信息,把验证码数字保存到session*/
    return captcha;
  }

  async md5(str) {

    return md5(str);
  }
  async getTime() {

    const d = new Date();

    return d.getTime();

  }
}

module.exports = ToolsService;
