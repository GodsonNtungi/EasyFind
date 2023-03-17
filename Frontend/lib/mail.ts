import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";


export const emailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'dev.isopride@gmail.com',
        pass: 'nmdzzjbdpvhzsxbj',
    },
    tls: {
        rejectUnauthorized: false
    }
});

export interface Attachment {
    path: string
}

export interface EmailProps {
    from: string;
    to: string;
    subject: string;
    emailHtml: string;
    attachments?: Attachment[];
}


export function sendEmail(props: EmailProps, callback: (err: (Error | null), info: SMTPTransport.SentMessageInfo) => void) {
    console.log(props)
    let options = {
        from: props.from,
        to: props.to,
        subject: props.subject,
        html: props.emailHtml,
        attachments: [] as Attachment[]
    } ;

    if (props.attachments !== undefined) {
        options.attachments = props.attachments
    }

    return emailTransporter.sendMail(options, callback);
}