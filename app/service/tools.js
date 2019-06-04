'use strict';

const svgCaptcha = require('svg-captcha'); // 引入验证

// 上传图片时引用的
const sd = require('silly-datetime');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');

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
  async getUploadFile(filename) {
    // 1、获取当前日期     20180920
    const day = sd.format(new Date(), 'YYYYMMDD');
    // 2、创建图片保存的路径
    const dir = path.join(this.config.uploadDir, day);
    await mkdirp(dir);
    const d = await this.getTime(); /* 毫秒数*/
    // 返回图片保存的路径
    const uploadDir = path.join(dir, d + path.extname(filename));
    // app\public\admin\upload\20180914\1536895331444.png
    return {
      uploadDir,
      saveDir: uploadDir.slice(3).replace(/\\/g, '/'),
    };
  }
}

module.exports = ToolsService;
