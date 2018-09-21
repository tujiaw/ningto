'use strict'

var PostsModel = require('../models/posts');
var CommentsModel = require('../models/comments');
var SearchKeyModel = require('../models/searchKey');
var MongoHelp = require('../models/mongo').mongoHelp;
var config = require('../config');
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

const PAGE_COUNT = config.pageCount;
const SEARCH_KEY_COUNT = config.searchKeyCount;
const PAGE_STEP = 5;
const HOT_POST_COUNT = 10;

function isRestapi(ctx) {
  return ctx.path.indexOf('/api') === 0
}

function getRandomItems(arr, num) {
  //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
  var temp_array = new Array();
  for (var index in arr) {
      temp_array.push(arr[index]);
  }
  //取出的数值项,保存在此数组
  var return_array = new Array();
  for (var i = 0; i<num; i++) {
      //判断如果数组还有可以取出的元素,以防下标越界
      if (temp_array.length>0) {
          //在数组中产生一个随机索引
          var arrIndex = Math.floor(Math.random()*temp_array.length);
          //将此随机索引的对应的数组元素值复制出来
          return_array[i] = temp_array[arrIndex];
          //然后删掉此索引的数组元素,这时候temp_array变为新的数组
          temp_array.splice(arrIndex, 1);
      } else {
          //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
          break;
      }
  }
  return return_array;
}

function getArchives(posts) {
  MongoHelp.addAllCreateDateTime(posts);
  var archives = [];
  var createTitle = function(item) {
    return {
      _id: item._doc._id,
      created_at: item.created_at,
      from_now: item.from_now,
      title: item.title,
    }
  };
  posts.forEach(function(item) {
    var i = 0;
    var isFind = false;
    var yearMonth = item.created_at.substr(0, 7);
    while (i < archives.length) {
      if (archives[i].yearMonth === yearMonth) {
        archives[i].titles.push(createTitle(item));
        break;
      }
      i++;
    }

    if (i === archives.length) {
      var archivesItem = {
        yearMonth: yearMonth,
        titles: [createTitle(item)],
      };
      archives.push(archivesItem);
    }
  });
  return archives;
}

async function getRightSidebarData(ctx) {
  let allPosts = await PostsModel.getPostsProfile();
  allPosts = allPosts.sort((a, b) => ( b.pv - a.pv ));
  const totalCount = allPosts.length;
  const tagsCount = []
  const archivesCount = {}
  allPosts.forEach((post) => {
    // 归档
    const createYearMonth = moment(objectIdToTimestamp(post._id)).format('YYYY-MM-DD').substr(0, 7);
    if (createYearMonth.length) {
      if (archivesCount[createYearMonth]) {
        archivesCount[createYearMonth]++;
      } else {
        archivesCount[createYearMonth] = 1;
      }
    }
    
    // 标签
    post.tags.forEach((tag) => {
        if (tag.length) {
          const fitem = tagsCount.find((item) => ( item.name === tag ));
          if (fitem) {
            fitem.count++;
          } else {
            tagsCount.push({ name: tag, count: 1})
          }
        }
    })
  })
  
  const result = {}
  result.profile = {
    postCount: totalCount,
    hitCount: ctx.state.totalhit,
    hitToday: ctx.state.todayhit
  };
  // 热搜
  result.hotPosts = getRandomItems(allPosts.slice(0, 50), 10);
  result.tagsCount = tagsCount;
  result.archives = []
  for (let item in archivesCount) {
    result.archives.push({
      yearMonth: item,
      count: archivesCount[item]
    })
  }
  result.archives.sort((a, b) => a.yearMonth > b.yearMonth ? -1 : 1);
  return result
}

module.exports.rightsidebar = async function(ctx) {
  try {
    const result = {
      rightSidebarData: await getRightSidebarData(ctx)
    }
    ctx.body = result
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.list = async function(ctx) {
  var page = ctx.query.page || 1
  page = parseInt(page)
  try {
    const pagePosts = await PostsModel.getPostsProfile(null, page)
    const totalCount = await PostsModel.getPostsCount(null)
    MongoHelp.addAllCreateDateTime(pagePosts);
    MongoHelp.postsContent2Profile(pagePosts);

    var pageNumbers = [];
    var lastPage = Math.ceil(totalCount / PAGE_COUNT);
    if (page <= lastPage) {
      var i = 1;
      if (page <= 3) {
        for (i = 1; i <= page; i++) {
          pageNumbers.push(i);
        }
        for (i = page + 1; i <= lastPage && pageNumbers.length < 5; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(0);
        for (i = page - 2; i <= Math.min(page + 2, lastPage); i++) {
          pageNumbers.push(i);
        }
      }
      if (lastPage > i) {
        pageNumbers.push(0);
      }
    }

    var prevPage = Math.max(page - 1, 1);
    var nextPage = Math.min(lastPage, page + 1);
    var morePage;
    if (pageNumbers.length) {
      if (pageNumbers[0] === 0) {
        morePage = Math.max(page - PAGE_STEP, 1);
      }
      if (pageNumbers[pageNumbers.length - 1] === 0) {
        morePage = Math.min(page + PAGE_STEP, lastPage);
      }
    }
    
    const result = {
      user: ctx.session.user,
      posts: pagePosts,
      page: page,
      lastPage: lastPage,
      pageNumbers: pageNumbers,
      prevPage: prevPage,
      nextPage: nextPage,
      morePage: morePage,
    }

    if (isRestapi(ctx)) {
      result.rightSidebarData = await getRightSidebarData(ctx);
      ctx.body = result;
    } else {
      ctx.body = await ctx.render('list', result)  
    }
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.title = async function(ctx) {
  console.log(ctx.query)
  const type = ctx.query.type || ''
  const keyword = ctx.query.keyword || ''
  if (type.length === 0 || keyword.length === 0) {
    ctx.throw('need type and keyword')
  }

  try {
    const result = {}
    if (type === 'search') {
      result.tagname = '搜索 & ' + keyword
      await SearchKeyModel.setSearchKey(keyword.toLowerCase())
      const searchResult = await PostsModel.searchPost(keyword)
      result.archives = getArchives(searchResult)
    } else if (type === 'tag') {
      result.tagname = '类别 & ' + keyword
      let posts = await PostsModel.getPostByTag(keyword)
      result.archives = getArchives(posts)
    } else if (type === 'yearMonth') {
      result.tagname = '存档 & ' + keyword
      let posts = await PostsModel.getPostsProfile()
      posts = posts.filter((item) => {
        return moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD').substr(0, 7) === keyword
      })
      result.archives = getArchives(posts)
    } else {
      ctx.throw('type is error')
    }

    result.rightSidebarData = await getRightSidebarData(ctx)
    ctx.body = result
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.show = async function(ctx, id) {
  if (!id) {
    ctx.throw(404, 'invalid post id')
  }

  try {
    const post = await PostsModel.getPostById(id)
    const prevPosts = await PostsModel.getPrevPostById(id)
    const nextPosts = await PostsModel.getNextPostById(id)
    await PostsModel.incPv(id)
    MongoHelp.addOneCreateAt(post)
    MongoHelp.post2html(post)

    const MAX_NAV_TITLE_LENGTH = 30;
    let prevPost = prevPosts.length > 0 ? prevPosts[0] : null;
    let nextPost = nextPosts.length > 0 ? nextPosts[0] : null;
    if (prevPost && prevPost.title.length > MAX_NAV_TITLE_LENGTH) {
      prevPost.title = prevPost.title.substr(0, MAX_NAV_TITLE_LENGTH) + '...';
    }
    if (nextPost && nextPost.title.length > MAX_NAV_TITLE_LENGTH) {
      nextPost.title = nextPost.title.substr(0, MAX_NAV_TITLE_LENGTH) + '...';
    }

    const commentList = await CommentsModel.getByPostId(id)
    let comments = []
    if (commentList && Array.isArray(commentList)) {
        MongoHelp.addAllCreateDateTime(commentList)
        comments = commentList.map(item => {
          return {
              id: item.id,
              name: item.name,
              content: item.content,
              created_at: item.created_at
          }
        })
    }

    const result = {
      post: post,
      comments: comments,
      deleteComment: (ctx.session.user && ctx.session.user.username === 'tujiaw'),
      prevPost: prevPost,
      nextPost: nextPost
    }

    if (isRestapi(ctx)) {
      result.rightSidebarData = await getRightSidebarData(ctx)
      result.toc = result.post.toc
      ctx.body = result
    } else {
      ctx.body = await ctx.render('show', result)
    }
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.write = async function(ctx) {
  if (!ctx.session.user) {
    ctx.redirect('/user/signin')
    return
  }

  ctx.body = await ctx.render('write', {
    tags: config.tags
  })
}

module.exports.reqAdd = async function(ctx) {
  if (!ctx.session.user) {
    ctx.redirect('/user/signin')
    return
  }

  const user = ctx.session.user
  let post = ctx.request.body
  const tags = post.tags.split(';')
  console.log(post);
  if (!post.title || !post.content) {
    ctx.body = await ctx.render('title or content is empty')
    return
  }

  post.author = user._id
  post.pv = 1
  post.tags = tags
  await new PostsModel(post).save()
  ctx.redirect(post.continue_write ? '/write' : '/');
}

module.exports.archives = async function(ctx, next) {
  try {
    let posts = await PostsModel.getPostsProfile()
    const archives = getArchives(posts)
    ctx.body = await ctx.render('archives', {
      archives: archives
    })
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.search = async function(ctx, next) {
  const keyword = ctx.query.keyword || ''
  ctx.body = await ctx.render('search', {
    tags: config.tags,
    keyword: keyword
  })
}

module.exports.reqSearch = async function(ctx, next) {
  const req = ctx.request.body
  const keyword = req.keyword
  let posts = []
  let searchKeys = []
  const result = {}
  if (keyword.length) {
    await SearchKeyModel.setSearchKey(keyword.toLowerCase())
    const searchResult = await PostsModel.searchPost(keyword)
    searchKeys = await SearchKeyModel.getSearchKey(SEARCH_KEY_COUNT)
    posts = MongoHelp.postsContent2Profile(searchResult)
    result.posts = posts
    result.keys = searchKeys
  }
  ctx.body = result
}

module.exports.titleSearch = async function(ctx, next) {
  const keyword = ctx.query.keyword || ''
  const searchResult = await PostsModel.searchPost(keyword, true)
  if (searchResult.length) {
    ctx.redirect('/post/' + searchResult[0]._id)
  } else {
    ctx.redirect('/search')
  }
}

// 热搜文章
module.exports.reqHotSearch = async function(ctx, next) {
  let posts = []
  const searchPosts = await PostsModel.hotSearchPost(HOT_POST_COUNT)
  const searchKeys = await SearchKeyModel.getSearchKey(SEARCH_KEY_COUNT)
  posts = MongoHelp.postsContent2Profile(searchPosts)
  ctx.body = { posts: posts, keys: searchKeys }
}

module.exports.remove = async function(ctx, id) {
  if (!ctx.session.user) {
    ctx.redirect('/user/signin')
    return
  }

  if (!id) {
    ctx.throw(404, 'invalid post id')
  }

  try {
    console.log(`remove author:${ctx.session.user._id}, id:${id}`)
    await PostsModel.delPostById(id, ctx.session.user._id)
    ctx.redirect('/')
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.edit = async function(ctx, id) {
  if (!ctx.session.user) {
    ctx.redirect('/user/signin')
    return
  }

  if (!id) {
    ctx.throw(404, 'invalid post id')
  }

  try {
    const post = await PostsModel.getRawPostById(id)
    if (!post) {
      ctx.throw('文章不存在')
    }
    if (post.author._id.toString() !== ctx.session.user._id.toString()) {
      ctx.throw('权限不足')
    }
    ctx.render('write', {
      post: post,
      tags: config.tags
    })
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.tags = async function(ctx, name) {
  if (!name) {
    ctx.throw(404, 'invalid tag name')
  }
  try {
    let posts = await PostsModel.getPostByTag(name)
    const archives = getArchives(posts)
    const result = {
      tagname: '标签 & ' + name,
      archives: archives
    }

    ctx.body = await ctx.render('archives', result)
  } catch (err) {
    ctx.throw(err)
  }
}

module.exports.pictureWall = async function(ctx) {
  if (!ctx.session.user || ctx.session.user.login !== 'tujiaw') {
    ctx.redirect('/')
    return
  }

  ctx.body = await ctx.render('picture_wall');
}

module.exports.reqEdit = async function(ctx) {
  const user = ctx.session.user
  let post = ctx.request.body

  const title = post.title
  const content = post.content
  const tags = post.tags.split(';')
  if (!post.title || !post.content) {
    ctx.body = await ctx.render('title or content is empty')
    return
  }

  try {
    await PostsModel.updatePostById(post._id, user._id, {
      title: title,
      content: content,
      tags: tags
    })
    ctx.redirect('/post/' + post._id)
  } catch (err) {
    ctx.throw(err)
  }
}

