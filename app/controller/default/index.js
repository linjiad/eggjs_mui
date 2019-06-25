'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {


    // 获取顶部导航的数据

    const topNav = await this.ctx.model.Nav.find({ position: 1 });


    // 轮播图

    const focus = await this.ctx.model.Focus.find({ type: 1 });


    // 商品分类

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

    // 获取中间导航的数据
    /*
          不可拓展属性的对象    http://bbs.itying.com/topic/5bea72c10e525017c44947cf
        */
    let middleNav = await this.ctx.model.Nav.find({ position: 2 });

    middleNav = JSON.parse(JSON.stringify(middleNav)); // 1、不可扩展对象

    for (let i = 0; i < middleNav.length; i++) {
      if (middleNav[i].relation) {
        // 数据库查找relation对应的商品
        try {
          // 把中文逗号替换成英文的，并且转换成数组
          const tempArr = middleNav[i].relation.replace(/，/g, ',').split(',');
          const tempRelationIds = [];
          // 把string类型转换成Objectid，放到数组中
          tempArr.forEach(value => {
            tempRelationIds.push({
              _id: this.app.mongoose.Types.ObjectId(value),
            });
          });
          // 进行查询（指定查询title和图片）
          const relationGoods = await this.ctx.model.Goods.find({
            $or: tempRelationIds,
          }, 'title goods_img');

          middleNav[i].subGoods = relationGoods;

        } catch (err) { // 2、如果用户输入了错误的ObjectID（商品id）

          middleNav[i].subGoods = [];
        }
      } else {
        middleNav[i].subGoods = [];
      }
    }
    // console.log(middleNav);
    // console.log(topNav);

    // 获取手机分类对应的数据
    // 1、获取当前分类下面的所有子分类
    // var shoujiCateIdsResult=await this.ctx.model.GoodsCate.find({"pid":this.app.mongoose.Types.ObjectId('5bbf058f9079450a903cb77b')},'_id');

    // //2、商品表里面查找分类id 在手机分类的子分类里面的（推荐的）所有数据

    // var cateIdsArr=[];
    // shoujiCateIdsResult.forEach((value)=>{
    //   cateIdsArr.push({
    //     "cate_id":value._id
    //   })
    // })


    // var shoujiResult=await this.ctx.model.Goods.find({
    //   $or:cateIdsArr
    // })

    // 手机
    const shoujiResult = await this.service.goods.get_category_recommend_goods('5bbf058f9079450a903cb77b', 'best', 8);
    // 电视
    const dianshiResult = await this.service.goods.get_category_recommend_goods('5bbf05ac9079450a903cb77c', 'best', 10);
    console.log(dianshiResult);
    await this.ctx.render('default/index', {
      topNav,
      focus,
      goodsCate,
      middleNav,
      shoujiResult,
    });

  }
}

module.exports = IndexController;
