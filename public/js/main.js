'use strict';

$(document).ready(function() {
  var trigger = $('.hamburger');
  trigger.click(function() {
    hamburger_cross();
  });

  function hamburger_cross() {
    if (trigger.hasClass('is-open')) {
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
    } else {
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
    }
  }

  $('[data-toggle="offcanvas"]').click(function() {
    $('#wrapper').toggleClass('toggled');

    // 内容居中
    $('#page-content-wrapper').toggleClass('toggled');
    $('.page-content .row>div:eq(0)').toggleClass('col-md-1');
    $('.page-content .row>div:eq(1)').toggleClass('col-md-10');
    $('.page-content .row>div:eq(2)').toggleClass('col-md-1');
    $('.page-content .row>div:eq(0)').toggleClass('col-md-3');
    $('.page-content .row>div:eq(1)').toggleClass('col-md-6');
    $('.page-content .row>div:eq(2)').toggleClass('col-md-3');
  });

  $('.back-to-top').on('click', function() {
    $('body,html').animate({ scrollTop: 0 }, 800);
  })

  $('.profile .search-group').on('keydown', function(event) {
    if (event.keyCode == '13') {
      const keyword = $(event.target).val().trim()
      if (!keyword.length) {
        return
      }
      window.open('/titlesearch?keyword=' + encodeURIComponent(keyword), '_self')
    }
  })

  if (!(isMobile.Android() || isMobile.IOS())) {
    $('.right-bottom-panel').show();
    var updatePercent = function() {
      let percent = $(window).scrollTop() / ($(document).height() - $(window).height());
      percent = parseInt(percent * 100);
      percent = isNaN(percent) ? 0 : percent;
      $('#percent').text('' + percent + '%');
    };

    updatePercent();
    $(window).scroll(function() {
      updatePercent();
    });

    $('#side-popup').on('click', function() {
      const chat = $('#chat-frame');
      if (chat.attr('src') === undefined || chat.attr('src').length === 0) {
        chat.attr('src', 'http://chat.ningto.com');
        chat.focus();
      }
      chat.toggle();
      $(this).text($('#chat-frame').is(':hidden') ? "聊天" : "收起");
    })
  }
});