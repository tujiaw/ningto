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
      window.open('/search?keyword=' + encodeURIComponent(keyword), '_self')
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

  (function fairyDustCursor() {

    var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cursor = {x: width/2, y: width/2};
    var particles = [];

    function init() {
      bindEvents();
      loop();
    }

    // Bind events that are needed
    function bindEvents() {
        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize(e) {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    function onMouseMove(e) {
      cursor.x = e.clientX;
      cursor.y = e.clientY;

      addParticle( cursor.x, cursor.y, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
    }

    function addParticle(x, y, color) {
      var particle = new Particle();
      particle.init(x, y, color);
      particles.push(particle);
    }

    function updateParticles() {

      // Updated
      for( var i = 0; i < particles.length; i++ ) {
        particles[i].update();
      }

      // Remove dead particles
      for( var i = particles.length -1; i >= 0; i-- ) {
        if( particles[i].lifeSpan < 0 ) {
          particles[i].die();
          particles.splice(i, 1);
        }
      }

    }

    function loop() {
      requestAnimationFrame(loop);
      updateParticles();
    }

    /**
     * Particles
     */

    function Particle() {

      this.character = "*";
      this.lifeSpan = 120; //ms
      this.initialStyles ={
        "position": "fixed",
        "display": "inline-block",
        "top": "0px",
        "left": "0px",
        "pointerEvents": "none",
        "touch-action": "none",
        "z-index": "10000000",
        "fontSize": "25px",
        "will-change": "transform"
      };

      // Init, and set properties
      this.init = function(x, y, color) {

        this.velocity = {
          x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
          y: 1
        };

        this.position = {x: x + 10, y: y + 10};
        this.initialStyles.color = color;

        this.element = document.createElement('span');
        this.element.innerHTML = this.character;
        applyProperties(this.element, this.initialStyles);
        this.update();

        document.querySelector('.js-cursor-container').appendChild(this.element);
      };

      this.update = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.lifeSpan--;

        this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (this.lifeSpan / 120) + ")";
      }

        this.die = function () {
              this.element.parentNode.removeChild(this.element);
      }

    }

    /**
     * Utils
     */

    // Applies css `properties` to an element.
    function applyProperties( target, properties ) {
      for( var key in properties ) {
        target.style[ key ] = properties[ key ];
      }
    }

    if (!('ontouchstart' in window || navigator.msMaxTouchPoints)) init();
  })();
  
});