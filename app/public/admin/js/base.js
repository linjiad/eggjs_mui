const app = {


  init() {
    this.toggleAside();

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
