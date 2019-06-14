'use strict';

const svgCaptcha = require('svg-captcha'); // 引入验证

// 上传图片时引用的
const sd = require('silly-datetime'); // 事件相关插件模块
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');

const Service = require('egg').Service;
// md5加密
const md5 = require('md5');

const Jimp = require('jimp'); // 生成缩略图的模块

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
  // 获取时间
  async getTime() {
    const d = new Date();
    return d.getTime();
  }
  async getUploadFile(filename) {
    // 1、获取当前日期     20180920
    const day = sd.format(new Date(), 'YYYYMMDD');
    // 2、创建图片保存的路径（创建文件夹）
    const dir = path.join(this.config.uploadDir, day);
    await mkdirp(dir);// 创建文件
    const d = await this.getTime(); /* 毫秒数*/
    // 返回图片保存的路径
    // 获取后缀名path.extname(filename)
    const uploadDir = path.join(dir, d + path.extname(filename));
    // app\public\admin\upload\20180914\1536895331444.png  用时间戳表示图片名称
    return {
      uploadDir, // 图片保存路径
      saveDir: uploadDir.slice(3).replace(/\\/g, '/'), // 数据库存储路径
    };
  }

  // 生成缩略图的公共方法
  async jimpImg(target) {
    // 上传图片成功以后生成缩略图
    Jimp.read(target, (err, lenna) => { // target选择图片
      if (err) throw err;
      lenna.resize(200, 200) // 图片大小
        .quality(90) // 图片质量
        .write(target + '_200x200' + path.extname(target)); // 生成缩略图
      lenna.resize(400, 400) // 再来一张
        .quality(90) // set JPEG quality
        .write(target + '_400x400' + path.extname(target)); // save
    });
  }
}

module.exports = ToolsService;
