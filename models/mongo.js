var config = require('config-lite');
var marked = require('marked');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
// DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

var renderer = new marked.Renderer();

const tocObj = { 
  add: function(text, level) {
    var anchor = `#toc${level}${++this.index}`;
    this.toc.push({ anchor: anchor, level: level, text: text });
    return anchor;
  },
  // 使用堆栈的方式处理嵌套的ul,li，level即ul的嵌套层次，1是最外层
  // <ul>
  //   <li></li>
  //   <ul>
  //     <li></li>
  //   </ul>
  //   <li></li>
  // </ul>
  toHTML: function() {
    let levelStack = [];
    let result = '';
    const addStartUL = () => { result += '<ul>'; };
    const addEndUL = () => { result += '</ul>\n'; };
    const addLI = (anchor, text) => { result += '<li><a href="#'+anchor+'">'+text+'<a></li>\n'; };

    this.toc.forEach(function (item) {
      let levelIndex = levelStack.indexOf(item.level);
      // 没有找到相应level的ul标签，则将li放入新增的ul中
      if (levelIndex === -1) {
        levelStack.unshift(item.level);
        addStartUL();
        addLI(item.anchor, item.text);
      } // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
      else if (levelIndex === 0) {
        addLI(item.anchor, item.text);
      } // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
      else {
        while (levelIndex--) {
          levelStack.shift();
          addEndUL();
        }
        addLI(item.anchor, item.text);
      }
    });
    // 如果栈中还有level，全部出栈打上闭合标签
    while(levelStack.length) {
      levelStack.shift();
      addEndUL();
    }
    // 清理先前数据供下次使用
    this.toc = [];
    this.index = 0;
    return result;
  },
  toc: [], 
  index: 0
};

renderer.heading = function(text, level, raw) {
  var anchor = tocObj.add(text, level);
  return `<a id=${anchor} class="anchor-fix"></a><h${level}>${text}</h${level}>\n`;
};

marked.setOptions({
    renderer: renderer,
    highlight: function(code) {
      return require("highlight.js").highlightAuto(code).value;
    },
});

mongoose.connect(config.mongodb);

const PROFILE_COUNT = 150;
module.exports.mongoose = mongoose;
module.exports.mongoHelp = {
  addOneCreateAt: function(result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
  },
  addAllCreateDateTime: function(results) {
    results.forEach(function(item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
      item.from_now = moment(objectIdToTimestamp(item._id)).fromNow();
    })
  },
  addAllCreateDate: function(results) {
    results.forEach(function(item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD');
    })
  },
  postsContent2html: function(posts, isProfile) {
    return posts.map(function(post) {
      post.content = marked(isProfile ? post.content.substr(0, PROFILE_COUNT) : post.content);
      return post;
    })
  },
  postContent2html: function(post, isProfile) {
    if (post) {
      post.content = marked(isProfile ? post.content.substr(0, PROFILE_COUNT) : post.content);
    }
    return post;
  },
  post2html: function(post) {
    if (post) {
      post.content = marked(post.content);
      post.toc = tocObj.toHTML();
    }
  },
  postsContent2Profile: function(posts) {
    return posts.map(function(post) {
      var profile = post.content.substr(0, PROFILE_COUNT);
      profile = profile.replace(/[\#|\`]/g,"");
      post.content = profile + '...';
      return post;
    });
  },
  id2time: function(id, format) {
    return moment(objectIdToTimestamp(id)).format(format);
  }
}
