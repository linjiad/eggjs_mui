'use strict';

const BaseController = require('./base.js');
const fs = require('fs');
const pump = require('mz-modules/pump');

class GoodsController extends BaseController {
  async index() {
    const goodsResult = await this.ctx.model.Goods.find({});
    await this.ctx.render('admin/goods/index', {
      list: goodsResult,
    });
  }
  async add() {
    // 获取所有的颜色值
    const colorResult = await this.ctx.model.GoodsColor.find({});
    // 获取所有的商品类型
    const goodsType = await this.ctx.model.GoodsType.find({});
    // 获取商品分类
    const goodsCate = await this.ctx.model.GoodsCate.aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);
    await this.ctx.render('admin/goods/add', {
      colorResult,
      goodsType,
      goodsCate,
    });

  }
  async edit() {
    // 获取修改数据的id
    const id = this.ctx.request.query.id;
    // 获取所有的颜色值
    const colorResult = await this.ctx.model.GoodsColor.find({});

    // 获取所有的商品类型
    const goodsType = await this.ctx.model.GoodsType.find({});

    // 获取商品分类

    const goodsCate = await this.ctx.model.GoodsCate.aggregate([

      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },

    ]);


    // 获取修改的商品

    const goodsResult = await this.ctx.model.Goods.find({ _id: id });

    console.log(goodsResult);

    // 获取规格信息  (待定)
    const goodsAttsResult = await this.ctx.model.GoodsAttr.find({ goods_id: goodsResult[0]._id });
    let goodsAttsStr = '';
    goodsAttsResult.forEach(async val => {
      if (val.attribute_type === 1) {
        goodsAttsStr += `<li><span>${val.attribute_title}:</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
      } else if (val.attribute_type === 2) {
        goodsAttsStr += `<li><span>${val.attribute_title}:</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
      } else {
        // 获取 attr_value  获取可选值列表
        const oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({
          _id: val.attribute_id,
        });
        const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');
        goodsAttsStr += `<li><span>${val.attribute_title}:</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;
        goodsAttsStr += '<select name="attr_value_list">';
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] === val.attribute_value) {
            goodsAttsStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
          } else {
            goodsAttsStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
          }
        }
        goodsAttsStr += '</select>';
        goodsAttsStr += '</li>';
      }
    });

    // 商品的图库信息
    const goodsImageResult = await this.ctx.model.GoodsImage.find({ goods_id: goodsResult[0]._id });

    console.log(goodsImageResult);

    await this.ctx.render('admin/goods/edit', {
      colorResult,
      goodsType,
      goodsCate,
      goods: goodsResult[0],
      goodsAtts: goodsAttsStr,
      goodsImage: goodsImageResult,

    });


  }
  async doAdd() {
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
    const formFields = Object.assign(files, parts.field);
    console.log(formFields);
    // 增加商品信息
    const goodsRes = new this.ctx.model.Goods(formFields);
    const result = await goodsRes.save();
    // console.log(result._id);
    // 增加图库信息
    const goods_image_list = formFields.goods_image_list;
    if (result._id && goods_image_list) {

      for (let i = 0; i < goods_image_list.length; i++) {
        const goodsImageRes = new this.ctx.model.GoodsImage({
          goods_id: result._id,
          img_url: goods_image_list[i],
        });

        await goodsImageRes.save();
      }

    }
    // 增加商品类型数据
    const attr_value_list = formFields.attr_value_list;
    const attr_id_list = formFields.attr_id_list;
    if (result._id && attr_id_list && attr_value_list) {
      for (let i = 0; i < attr_value_list.length; i++) {
        // 查询goods_type_attribute
        if (attr_value_list[i]) {
          const goodsTypeAttributeResutl = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
          const goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id: result._id,
            cate_id: formFields.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeResutl[0].attr_type,
            attribute_title: goodsTypeAttributeResutl[0].title,
            attribute_value: attr_value_list[i],
          });
          await goodsAttrRes.save();
        }
      }
    }
    await this.success('/admin/goods', '增加商品数据成功');

  }

  // 获取商品类型的属性 api接口
  async goodsTypeAttribute() {
    const cate_id = this.ctx.request.query.cate_id;
    // 注意 await
    const goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ cate_id });
    console.log(goodsTypeAttribute);
    this.ctx.body = {
      result: goodsTypeAttribute,
    };
  }
  // 上传图片
  async goodsUploadImage() {
    // 实现图片上传
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
    console.log(files);
    // 图片的地址转化成 {link: 'path/to/image.jpg'}
    this.ctx.body = { link: files.file };
  }
  // 批量上传图片
  // 上传相册的图片
  async goodsUploadPhoto() {
    // 实现图片上传
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
      // 生成缩略图
      this.service.tools.jimpImg(target);

    }
    // 图片的地址转化成 {link: 'path/to/image.jpg'}
    this.ctx.body = { link: files.file };
  }

}

module.exports = GoodsController;
