// 메뉴 풀스크린
$(document).ready(function() {
  
    var Menu = (function() {
      var burger     = $('.burger');
      var menu       = $('.menu');
      var menuList   = $('.menu__list');
      var brand      = $('.menu__brand');
      var menuItems  = $('.menu__item');
      var menuLink   = $('.menu__link');
   
      var active = false;
      
      var toggleMenu = function() {
        if (!active) {
           $('.menu').addClass('menu--active');
           $('.menu__list').addClass('menu__list--active');
           $('.menu__brand').addClass('menu__brand--active');
           $('.burger').addClass('burger--close');
        
          active = true;
        } else {
          menu.removeClass('menu--active');
          menuList.removeClass('menu__list--active');
          brand.removeClass('menu__brand--active');
          burger.removeClass('burger--close');

          active = false;
        }
      };

      var toggleMenuLink = function() {
        if (!active) {
           $('.menu').addClass('menu--active');
           $('.menu__list').addClass('menu__list--active');
           $('.menu__brand').addClass('menu__brand--active');
           $('.burger').addClass('burger--close');
        
          active = true;
        } else {
          menu.removeClass('menu--active');
          menuList.removeClass('menu__list--active');
          brand.removeClass('menu__brand--active');
          burger.removeClass('burger--close');

          active = false;
        }
      };


      var bindActions = function() {
        document.querySelector('.burger').addEventListener('click', toggleMenu, false);
        document.querySelector('.link01').addEventListener('click', toggleMenuLink, false);
        document.querySelector('.link02').addEventListener('click', toggleMenuLink, false);
        document.querySelector('.link03').addEventListener('click', toggleMenuLink, false);
      };
     
      var init = function() {
        bindActions();
      };
      
      return {
        init: init
      };
      
    }());
    
    Menu.init();
    
  }());