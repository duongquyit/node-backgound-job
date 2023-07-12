require('dotenv').config();
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

const { BullQueue } = require('./libs');
const { redisConfig, mailerConfig } = require('./config');

BullQueue.init('scheduleJob', redisConfig);
BullQueue.addJob({ name: 'Quy' }, { repeat: { cron: '*/10 * * * * *' } });
BullQueue.onMessage((job) => {
  console.log(`Hi, my name is ${job.data.name}`);
});

BullQueue.init('mailerJob', redisConfig);
BullQueue.onMessage((job) => {
  console.log('Handle send mail');
  const transporter = nodemailer.createTransport(mailerConfig);
  transporter.sendMail(job.data );
});
// BullQueue.onCompleted(() => {
//   console.log('Send mail completed');
// });

app.get('/', (req, res) => {
  try {
    const sendMailData = {
      from: 'test@example',
      to: 'quynd@gmail.com',
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    }

    BullQueue.addJob(sendMailData);

    res.end();
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.info(`App running on ${process.env.HOST}:${process.env.PORT}`);
});

