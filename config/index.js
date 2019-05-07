module.exports = {
  title: '泞途 - 泊客网',
  desc: 'Keep It Simple, Stupid',
  port: 3000,
  pageCount: 20,
  searchKeyCount: 8,
  session: {
    secret: 'nodeblog',
    key: 'nodeblog',
    maxAge: 2592000000,
  },
  tags: ['Windows', 'Linux', 'Android', 'IOS', 'Mac', 'Mobile', 'C/C++', 'Qt', 'Node.js', 'Java', 'Database', 
        'Web', 'Tools', 'Bug', 'Life', 'Tips', 'Design', 'Javascript', 'MongoDB', 
        'React', 'Product', 'Go'],
  //mongodb: 'mongodb\://localhost:27017/nodeblog', // :一定要转义
  blogUri: 'mongodb\://127.0.0.1:27017/nodeblog',
  poetryUri: 'mongodb\://127.0.0.1:27017/chinese-poetry',
  qiniu: {
    bucket: 'myimages',
    ak: 'C1NMwcgz9IAjZVnpYF5LvuCJ6HV5MyJek68QhPfz',
    sk: 'PcWuJ18qByV-hjo-EzSiND3WtdLB94-wRQUwMwCQ',
  },
  PREFIX_API: '/api',
  github: {
    client_id: '531ad8e4517595748d97',
    client_secret: 'bf123fc9fe25a30e3e33d7a07daf825b73e07dc6',
  }
};

// 1.安装mondb
// 2.mongod启动(浏览器上输入：http://localhost:27017/，显示：It looks like you are trying to access MongoDB over HTTP on the native driver port.)
// 3.mongo进入数据库操作，创建nodeblog集合
// 4.use nodeblog
// 5.db.createCollection('user')
// 6.最后npm start才能成功