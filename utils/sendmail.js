const nodemailer = require('nodemailer');

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
      text: typeof(text) === 'string' ? text : JSON.stringify(text)
    };
    transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('send success', info)
      }
    });
  }
};
