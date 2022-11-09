const smtp = require('nodemailer-smtp-transport');
const nodeMailer = require('nodemailer');

const sendMailForClient = (email, subject, text) => {
    const transporterDetailes = smtp({
        host: "artin.pws-dns.net", //your host name it is
        port: 465,
        secure: true,
        auth: {
            user: "domanmail@doman.ac.ir",
            pass: "Ab@Ka7981"
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    const options = {
        from: "domanmail@doman.ac.ir",
        to: email, //this is an fake mail here mfuofike@hi2.in
        subject: subject,
        html: text
    }
    const transporter = nodeMailer.createTransport(transporterDetailes);

    transporter.sendMail(options, (err, info) => {
        if (err) console.log(err);
        else console.log(info);
    })
}

module.exports = {
    sendMailForClient
}