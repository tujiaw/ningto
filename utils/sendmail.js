const nodemailer = require('nodemailer');
const log = require('log4js').getLogger('app')

const transporter = nodemailer.createTransport({
  service: '163',
  auth: {
    user: 'tujiaw@163.com',
    pass: 'Abc1233' //授权码
  }
});

module.exports = {
  sendToSumscope: (subject, text) => {
    const options = {
      from: 'tujiaw@163.com',
      to: 'jiawei.tu@sumscope.com',
      subject,
      text: typeof(text) === 'string' ? text : JSON.stringify(text, null, 2)
    };
    transporter.sendMail(options, function (err, info) {
      if (err) {
        log.debug(err);
      } else {
        log.debug('send success', info)
      }
    });
  }
};
