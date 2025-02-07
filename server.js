const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));

// Nodemailer transporter 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jdh251425142514@gmail.com', // Gmail 계정
        pass: 'vcxjetcjbidaauja'   // Gmail 계정 비밀번호 또는 앱 비밀번호
    }
});

// 이메일 전송 엔드포인트
app.post('/api/send-email', async (req, res) => {
    const { to, subject, image } = req.body;

    const mailOptions = {
        from: 'jdh251425142514@gmail.com',
        to: to,
        subject: subject,
        html: '<h1>Your Generated Image</h1><p>See attached image:</p>',
        attachments: [{
        filename: 'generated-image.png',
        content: image,
        encoding: 'base64'
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });