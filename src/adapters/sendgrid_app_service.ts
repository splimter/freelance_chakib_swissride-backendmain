import sgMail from '@sendgrid/mail'
import configENV from '../utils/config_env'

sgMail.setApiKey(configENV.SENDGRID_API_KEY)

export function sendEmailAccountCreation(email: string, username: string, password: string) {
    const html = `
    <h1>Welcome to HOP TAXI</h1>
    <p>Your account has been created successfully</p>
    <p>Username: ${username}</p>
    <p>Password: ${password}</p>
`
    const msg = {
        to: email,
        from: 'info@hop-limo.ch',
        subject: 'HOP TAXI ~ Account creation',
        html: html,
    }
    console.log({msg})

    try {
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            });
        return true
    } catch (error) {
        return null
    }
}