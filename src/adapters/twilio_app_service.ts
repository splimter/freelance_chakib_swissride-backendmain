const accountSid = 'ACaf64bbde4cf3042cb21eede09b714942';
const authToken = '7438a6f9b39f33c129bdc838b3b4cbcc';

const data = new URLSearchParams();
data.append('To', 'whatsapp:+351933715426');
data.append('From', 'whatsapp:+41764418060');
data.append('ContentSid', 'HXb5b62575e6e4ff6129ad7c8efe1f983e');
data.append('ContentVariables', '{"1":"12/1","2":"3pm"}');

export const sendWhatsAppMessage = async () => {
    const data = new URLSearchParams();
    data.append('From', 'whatsapp:+41764418060');
    data.append('To', 'whatsapp:+351933715426');
    data.append('Body', 'Your appointment is coming up on July 21 at 3PM');

    fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // await fetch('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: data
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log({data});
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
}
