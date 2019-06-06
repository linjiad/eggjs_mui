'use strict';
const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump');
/*
1、安装mz-modules

https://github.com/node-modules/mz-modules

https://github.com/mafintosh/pump
*/

const BaseController = require('./base.js');

class FocusController extends BaseController {
  async index() {

    // 获取轮播图的数据

    const result = await this.ctx.model.Focus.find({});

    await this.ctx.render('admin/focus/index', {

      list: result,
    });
  }
  async add() {
    await this.ctx.render('admin/focus/add');
  }

  async doAdd() {

    const parts = this.ctx.multipart({ autoFields: true });
    let stream;
    let files = {};
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字

      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      // 上传图片到项目中
      await pump(stream, writeStream);
      // 拼接model
      files = Object.assign(files, { // 对象的拼接
        [fieldname]: dir.saveDir,
      });
    }

    // 原来是这样的：[{"focus_img":"/public/admin/upload/20180914/1536895826566.png"}，{"aaaa":"/public/admin/upload/20180914/1536895826566.png"}]

    // 想要的是这样的：{"focus_img":"/public/admin/upload/20180914/1536895826566.png",'aaa':'/wefewt/ewtrewt'}

    // 拼接后是这样的：{"focus_img":"/public/admin/upload/20180914/1536895826566.png"，"title":"aaaaaaaa","link":"11111111111","sort":"11","status":"1"}
    // 图片路径上传到数据库
    const focus = new this.ctx.model.Focus(Object.assign(files, parts.field));
    const result = await focus.save();
    console.log(result);
    await this.success('/admin/focus', '增加轮播图成功');


  }
  async edit() {

    const id = this.ctx.request.query.id;

    const result = await this.ctx.model.Focus.find({ _id: id });

    console.log(result);

    await this.ctx.render('admin/focus/edit', {

      list: result[0],
    });

  }

  async doEdit() {
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字
      // 上传图片的目录
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    // 修改操作
    const id = parts.field.id;
    const updateResult = Object.assign(files, parts.field);

    const result = await this.ctx.model.Focus.updateOne({ _id: id }, updateResult);
    console.log(result);
    await this.success('/admin/focus', '修改轮播图成功');
  }
  async indexBack() {
    await this.ctx.render('admin/focus/indexBack');
  }
  async doSingleUpload() {
    // 单文件上传
    const stream = await this.ctx.getFileStream(); // 获取表单提交的数据
    // console.log(stream);
    // 上传的目录    注意目录要存在            zzz/ewfrewrewt/dsgdsg.jpg    path.basename()        dsgdsg.jpg
    const target = 'app/public/admin/upload/' + path.basename(stream.filename);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream); // 封装好的方法，如果上传失败浏览器不会卡死
    // stream.pipe(writeStream);   //可以用， 但是不建议（管道流）必须将上传的文件流消费掉，要不然浏览器响应会卡死
    this.ctx.body = {
      url: target,
      fields: stream.fields, // 表单的其他数据
    };
  }

  async multi() {
    await this.ctx.render('admin/focus/multi');
  }

  async doMultiUpload() {
    // { autoFields: true }:可以将除了文件的其它字段提取到 parts 的 filed 中
    // 多个图片/文件
    const parts = this.ctx.multipart({ autoFields: true });
    const files = [];
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) { // 注意如果没有传入图片直接返回
        return;
      }
      const fieldname = stream.fieldname; // file表单的名字  face
      const target = 'app/public/admin/upload/' + path.basename(stream.filename);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream); // 写入并销毁当前流   (egg  demo提供的)
      files.push({
        [fieldname]: target, // es6里面的属性名表达式
      });
    }
    this.ctx.body = {
      files,
      fields: parts.field, // 所有表单字段都能通过 `parts.fields`            放在while循环后面
    };
  }
}

module.exports = FocusController;
