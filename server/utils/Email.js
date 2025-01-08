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

    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });
    } catch (error) {
    }
};

const scheduleEmail = (id, date, to, subject, message) => {
    try {
        schedule.scheduleJob(id, date, () => {
            sendEmail(to, subject, message)
        })
    } catch (error) {
    }
};

const rescheduleEmail = (id, date, to, subject, message) => {
    try {
        schedule.rescheduleJob(id, date, () => {
            sendEmail(to, subject, message);
        });
    }
    catch (error) {
        scheduleEmail(id, date, to, subject, message);
    }
};

const cancelEmail = (id) => {
    schedule.cancelJob(id);
};

export { sendEmail, scheduleEmail, rescheduleEmail, cancelEmail };