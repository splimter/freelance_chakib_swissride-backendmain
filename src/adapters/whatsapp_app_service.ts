import * as dotenv from 'dotenv';
import {configENV} from "../utils";
import {IUserLogin} from "../models/user.model";
import {IRideOrderWhatsapp} from "../models/ride_order.model";


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

export async function sendWhatsAppCredentialsMessage(phone_number: string, name: string, user: IUserLogin): Promise<void> {
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
                "name": "hoptaxicred",
                "language": {
                    "code": "en"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": name
                            },
                            {
                                "type": "text",
                                "text": user.username
                            },
                            {
                                "type": "text",
                                "text": user.password
                            }
                        ]
                    }
                ]
            }
        }

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
export async function sendWhatsAppNewRideOrderMessage(phone_number: string, driverUsername: string, order: IRideOrderWhatsapp): Promise<void> {
    try {
        const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;
        if (!phone_number.startsWith('+')) {
            if (phone_number.startsWith('0')) {
                phone_number = phone_number.substring(1);
            }
            phone_number = `+41${phone_number}`;
        }
        // TODO - Add the order details to the message
        const payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "template",
            "template": {
                "name": "hoptaxineworder",
                "language": {
                    "code": "en"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": driverUsername
                            },
                            {
                                "type": "text",
                                "text": `${order.name} (Phone: ${order.phone}) (Email:${order.email})`
                            },
                            {
                                "type": "text",
                                "text": order.pickup
                            },
                            {
                                "type": "text",
                                "text": order.goingto
                            },
                            {
                                "type": "text",
                                "text": order.date
                            }
                        ]
                    }
                ]
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

// Usage
// sendWhatsAppMessage('Hello, this is a message from your Node.js application!');

// sendWhatsAppWelcomeMessage('+351933715426').then(r => console.log(r)).catch(e => console.error(e));