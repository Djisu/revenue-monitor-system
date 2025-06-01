import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
const router = express.Router();
// Load environment variables from .env file
dotenv.config();
/**
 * Sends an SMS message using the Infobip API directly via axios
 * @param phoneNumber - The recipient's phone number
 * @param message - The message content
 * @param sender - The sender ID
 * @returns Promise resolving to the Infobip response
 */
export async function sendSmsViaInfobip(phoneNumber, message, sender) {
    try {
        console.log('Sending SMS via direct API call to Infobip');
        console.log('API key:', process.env.INFOBIP_API_KEY?.substring(0, 5) + '...');
        console.log('Base URL:', process.env.INFOBIP_URL || 'https://api.infobip.com');
        // Format phone number if needed (ensure it has country code)
        const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+233${phoneNumber.replace(/^0/, '')}`;
        console.log('Formatted phone number:', formattedPhoneNumber);
        // Make direct API call to Infobip
        const response = await axios({
            method: 'POST',
            url: `${process.env.INFOBIP_URL || 'https://api.infobip.com'}/sms/2/text/advanced`,
            headers: {
                'Authorization': `App ${process.env.INFOBIP_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                messages: [
                    {
                        from: sender,
                        destinations: [
                            {
                                to: formattedPhoneNumber
                            }
                        ],
                        text: message
                    }
                ]
            }
        });
        console.log('SMS sent successfully:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error sending SMS via Infobip:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.error('Infobip API response:', error.response.data);
        }
        throw error;
    }
}
// Endpoint to send SMS
router.post('/send-sms-infobip', async (req, res) => {
    const { phoneNumber, message, sender } = req.body;
    // Validate required fields
    if (!phoneNumber || !message || !sender) {
        res.status(400).json({ success: false, message: 'Missing required parameters' });
        return;
    }
    try {
        const response = await sendSmsViaInfobip(phoneNumber, message, sender);
        res.status(200).json({ success: true, data: response });
    }
    catch (error) {
        console.error('Error in /send-sms-infobip endpoint:', error);
        res.status(500).json({ success: false, message: 'Error sending SMS', error });
    }
});
export default router;
//# sourceMappingURL=textmessagingRoute.js.map