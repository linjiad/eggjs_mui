'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.default.index.index);
  router.get('/plist', controller.default.product.list);
  router.get('/pinfo', controller.default.product.info);
  router.get('/pinfo', controller.default.product.info);
  router.get('/cart', controller.default.flow.cart);
  // 用户中心
  router.get('/login', controller.default.user.login);
  router.get('/register', controller.default.user.register);
  router.get('/user', controller.default.user.welcome);
  router.get('/user/order', controller.default.user.order);
};
