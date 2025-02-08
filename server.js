require('dotenv').config(); // .env 파일 로드

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Nodemailer transporter 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER, // 환경 변수에서 Gmail 계정 로드
        pass: EMAIL_PASS  // 환경 변수에서 Gmail 앱 비밀번호 로드
    }
});

// 이메일 전송 엔드포인트
app.post('/api/send-email', async (req, res) => {
    const { to, subject, image } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
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

// 서버 실행
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
