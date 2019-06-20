(function($) {

  const app = {
    init() {

      this.initSwiper();

      this.initNavSlide();
    },
    initSwiper() {
      new Swiper('.swiper-container', {
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },

      });
    },
    initNavSlide() {
      $('#nav_list>li').hover(function() {

        $(this).find('.children-list').show();
      }, function() {
        $(this).find('.children-list').hide();
      });

    },
  };

  $(function() {


    app.init();
  });


})($);
