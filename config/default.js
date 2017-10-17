module.exports = {
  title: '三家店 - 泊客网',
  desc: 'Keep It Simple, Stupid',
  port: 3000,
  pageCount: 20,
  searchKeyCount: 8,
  session: {
    secret: 'nodeblog',
    key: 'nodeblog',
    maxAge: 2592000000,
  },
  tags: ['Windows', 'Linux', 'Mobile', 'C/C++', 'Qt', 'Node.js', 'React', 'Database', 
        'Web', 'Tools', 'Bug', 'Life', 'Tips', 'Design', 'javascript'],
  mongodb: 'mongodb\://localhost:27017/nodeblog', // :一定要转义
  // mongodb:'mongodb\://tujiaw:123456@ds133428.mlab.com:33428/tujiawblog'
  // mongodb: 'mongodb\://123.57.244.170:27017/nodeblog',
  qiniu: {
    bucket: 'myimages',
    ak: 'C1NMwcgz9IAjZVnpYF5LvuCJ6HV5MyJek68QhPfz',
    sk: 'PcWuJ18qByV-hjo-EzSiND3WtdLB94-wRQUwMwCQ',
  }
};

// 1.安装mondb
// 2.mongod启动(浏览器上输入：http://localhost:27017/，显示：It looks like you are trying to access MongoDB over HTTP on the native driver port.)
// 3.mongo进入数据库操作，创建nodeblog集合
// 4.use nodeblog
// 5.db.createCollection('user')
// 6.最后npm start才能成功