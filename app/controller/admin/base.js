// 父类
'use strict';
const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl) {

    // this.ctx.body='成功';

    await this.ctx.render('admin/public/success', {

      redirectUrl,
    });


  }

  async error(redirectUrl) {

    // this.ctx.body='成功';

    await this.ctx.render('admin/public/error', {
      redirectUrl,
    });

  }


  // 验证码
  async verify() {


    const captcha = await this.service.tools.captcha(); // 服务里面的方法

    this.ctx.response.type = 'image/svg+xml'; /* 指定返回的类型*/

    this.ctx.body = captcha.data; /* 给页面返回一张图片*/


  }
}

module.exports = BaseController;
