const app = {
  init() {
    this.toggleAside();
    this.deleteConfirm();
  },
  // 删除提示
  deleteConfirm() {
    $('.delete').click(function() {
      const flag = confirm('您确定要删除吗?');
      return flag;
    });

  },
  toggleAside() {
    $('.aside h4').click(function() {
      $(this).siblings('ul').slideToggle();
    });
  },

  changeStatus(el, model, attr, id) {
    $.get('/admin/changeStatus', { model, attr, id }, function(data) {
      if (data.success) {
        if (el.src.indexOf('yes') !== -1) {
          el.src = '/public/admin/images/no.gif';
        } else {
          el.src = '/public/admin/images/yes.gif';
        }
      }
    });
  },
};
$(function() {

  app.init();
});
