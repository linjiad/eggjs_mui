'use strict';


const BaseController = require('./base.js');

class LoginController extends BaseController {
  async index() {

    await this.ctx.render('admin/login');
  }
  // 执行登录的方法
  async doLogin() {

    await this.success('/admin/login');
  }

}

module.exports = LoginController;
