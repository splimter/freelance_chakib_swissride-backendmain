import {configENV} from "../utils";
import {Twilio} from "twilio";

const accountSid = configENV.TWILIO_ACCOUNT_SID;
const authToken = configENV.TWILIO_AUTH_TOKEN;

const client = new Twilio(accountSid, authToken);

export async function sendSMSNotificationConfirmOrderMessage(phone_number: string) {
    if (!phone_number.startsWith('+')) {
        if (phone_number.startsWith('0')) {
            phone_number = phone_number.substring(1);
        }
        phone_number = `+41${phone_number}`;
    }
    try {
        const message = await client.messages.create({
            messagingServiceSid: configENV.MESSAGING_SERVICE_SID,
            to: phone_number,
            body: "HOP TAXI\nOrder has been well received, we will notify you when it is ready for pickup.\nDon't reply to this sms."
        });
        console.log(`[SMS] Message sent successfully to ${phone_number}. SID: ${message.sid}`);
    } catch (error) {
        console.error(`[SMS] Failed to send SMS to ${phone_number}. Error:`, error);
    }
}