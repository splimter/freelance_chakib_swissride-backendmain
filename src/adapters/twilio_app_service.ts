import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';
// const TOKEN = process.env.WHATSAPP_API_TOKEN;
// const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
// const RECIPIENT_NUMBER = process.env.RECIPIENT_NUMBER;
const TOKEN = "EAAWbVR3iqwoBOy3wDhnhFSllrdTM8VQaQD6fXeHN1LMbTQvzY8ZAkzDR16zSvywTDshhV9xh0ZCTDKmzJTGGPHWx2fhRFbOZBdWsj37yFJCn8kpvK5krExvkDA3gOmj6blIFHeMDeSgfFFn9qQvzBcHJLsEQZBX2R5P7Nf9xBpLToX8jefgCb0An47182IRJu8hGgUpVCVTum30h";
const PHONE_NUMBER_ID = "440155969191893";
const RECIPIENT_NUMBER = "+351933715426";

async function sendWhatsAppMessage(message: string): Promise<void> {
    try {
        const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            to: RECIPIENT_NUMBER,
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
sendWhatsAppMessage('Hello, this is a message from your Node.js application!');