'use strict';

var typeList = [
    {"id":"1","name":"热点"},
    {"id":"2","name":"段子手"},
    {"id":"3","name":"养生堂"},
    {"id":"4","name":"私房话"},
    {"id":"5","name":"八卦精"},
    {"id":"6","name":"爱生活"},
    {"id":"7","name":"财经迷"},
    {"id":"8","name":"汽车迷"},
    {"id":"9","name":"科技咖"},
    {"id":"10","name":"潮人帮"},
    {"id":"11","name":"辣妈帮"},
    {"id":"12","name":"点赞党"},
    {"id":"13","name":"旅行家"},
    {"id":"14","name":"职场人"},
    {"id":"15","name":"美食家"},
    {"id":"16","name":"古今通"},
    {"id":"17","name":"学霸族"},
    {"id":"18","name":"星座控"},
    {"id":"19","name":"体育迷"}
];

function getWchatHot(typeId, page) {
    var appParams = {typeId: (typeId || 1), page: (page || 1)};
    $('#main').data('typeId', appParams.typeId);
    $('#main').data('page', appParams.page);
    showapiRequest('http://route.showapi.com/582-2', 17262, appParams, function(json) {
      var html;
      console.log(json);
      if (json.showapi_res_code == 0) {
          var pagebean = json.showapi_res_body.pagebean;
          if (pagebean.contentlist.length > 0) {
            typeList.sort(function(left, right) {
                return left.id - right.id;
            });
            // 反盗链 https://www.zhihu.com/question/35044484
            var qqUrl = 'http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=';
            for (var i = 0; i < pagebean.contentlist.length; i++) {
              var contentImg = pagebean.contentlist[i].contentImg;
              pagebean.contentlist[i].contentImg = qqUrl + contentImg;
            }

            html = ejs.render($('#mainContent').html(), {typeList: typeList, pagebean: pagebean});
          } else {
            html = "content is empty!";
          }
      } else {
        html = json.showapi_res_msg;
      }
      $('#main').html(html);
      initTypePanel();
    });
}

function typeItemClicked(self) {
    getWchatHot($(self).attr('typeId'));
}

function articleItemClicked(self) {
    window.open($(self).attr('url'), '_blank');
    // bb.trackTitle({
    //     title: $(self).find('#title').text(),
    //     url: $(self).attr('url')
    // });
}

function prePageClicked(self) {
    getWchatHot($('#main').data('typeId'), parseInt($('#main').data('page')) - 1);
}

function nextPageClicked(self) {
    getWchatHot($('#main').data('typeId'), parseInt($('#main').data('page')) + 1);
}

// function currentTypeClicked(self) {
//     var isHidden = $('.typePanel').is(':hidden');
//     $('.typePanel').animate({width:'toggle'});
//     $('.glyphicon-chevron-left').css('display', isHidden ? "" : "none");
//     $('.glyphicon-chevron-right').css('display', isHidden ? "none" : "");
//     $('#main').data('isTypePanelHidden', !isHidden);
// }

function initTypePanel(isHidden) {
    var isTypePanelHidden = $('#main').data('isTypePanelHidden');
    if (isTypePanelHidden != undefined && isTypePanelHidden) {
        $('.typePanel').css('display', "none");
        $('.glyphicon-chevron-left').css('display', "none");
        $('.glyphicon-chevron-right').css('display', "");
        $('#main').data('isTypePanelHidden', true);
    }
}