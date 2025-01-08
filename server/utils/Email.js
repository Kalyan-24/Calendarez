import dotenv from "dotenv";
import schedule from "node-schedule";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    port: 465,
    auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_PASSWORD
    },
});

const sendEmail = async (to, subject, message) => {
    const mailOptions = {
        from: {
            name: 'Services - Calendarez',
            address: process.env.SERVICE_EMAIL
        },
        to: to,
        subject: subject,
        html: message,
    };

    await transporter.sendMail(mailOptions);
};

const scheduleEmail = async (id, date, to, subject, message) => {
    try {
        await schedule.scheduleJob(id, date, async () => {
            await sendEmail(to, subject, message)
        })
    } catch (error) {
    }
};

const rescheduleEmail = async (id, date, to, subject, message) => {
    try {
        await schedule.rescheduleJob(id, date, async () => {
            sendEmail(to, subject, message);
        });
    }
    catch (error) {
        await scheduleEmail(id, date, to, subject, message);
    }
};

const cancelEmail = async (id) => {
    await schedule.cancelJob(id);
};

export { sendEmail, scheduleEmail, rescheduleEmail, cancelEmail };