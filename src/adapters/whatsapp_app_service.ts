import * as dotenv from 'dotenv';
import {configENV} from "../utils";


const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';
const TOKEN = configENV.WHATSAPP_API_TOKEN;
const PHONE_NUMBER_ID = configENV.PHONE_NUMBER_ID;
// const RECIPIENT_NUMBER = "+351933715426";

export async function sendWhatsAppWelcomeMessage(phone_number: string): Promise<void> {
    try {
        const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;
        if (!phone_number.startsWith('+')) {
            if (phone_number.startsWith('0')) {
                phone_number = phone_number.substring(1);
            }
            phone_number = `+41${phone_number}`;
        }
        const payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "template",
            "template": {
                "name": "hoptaxi",
                "language": {
                    "code": "en"
                }
            }
        };

        const headers = {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Message sent successfully:', data);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}

async function sendWhatsAppMessage(message: string): Promise<void> {
    try {
        const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            to: "RECIPIENT_NUMBER",
            type: 'text',
            text: { body: message },
        };

        const headers = {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Message sent successfully:', data);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
}

// Usage
// sendWhatsAppMessage('Hello, this is a message from your Node.js application!');

// sendWhatsAppWelcomeMessage('+351933715426').then(r => console.log(r)).catch(e => console.error(e));