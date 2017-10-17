'use strict';

$(document).ready(function() {
  var trigger = $('.hamburger'),
    overlay = $('.overlay'),
    isClosed = true;

  trigger.click(function() {
    hamburger_cross();
  });

  function hamburger_cross() {
    if (trigger.hasClass('is-open')) {
      //overlay.hide();
      trigger.removeClass('is-open');
      trigger.addClass('is-closed');
      isClosed = false;
    } else {
      //overlay.show();
      trigger.removeClass('is-closed');
      trigger.addClass('is-open');
      isClosed = true;
    }
  }

  $('[data-toggle="offcanvas"]').click(function() {
    $('#wrapper').toggleClass('toggled');
  });

  $('.back-to-top').on('click', function() {
    $('body,html').animate({ scrollTop: 0 }, 800);
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
        chat.attr('src', 'http://chat.3inns.cn');
        chat.focus();
      }
      chat.toggle();
      $(this).text($('#chat-frame').is(':hidden') ? "聊天" : "收起");
    })
  }
});