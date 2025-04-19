import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
const app = express();
const port = 3000;
const router = express.Router();
// Load environment variables from .env file
dotenv.config();
const arkesel_api_key = process.env.ARKESEL_API_KEY;
if (!arkesel_api_key) {
    console.error('ARKESEL_API_KEY environment variable not set');
    process.exit(1);
}
// POST endpoint to send SMS
router.post('/sendsms', async (req, res) => {
    try {
        console.log('in router.post(/send-sms');
        const { to, from, sms, use_case } = req.body;
        if (!to || !from || !sms) {
            res.status(400).json({ error: 'to, from, and sms are required' });
            return;
        }
        const url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${arkesel_api_key}&to=${to}&from=${from}&sms=${encodeURIComponent(sms)}` +
            (use_case ? `&use_case=${use_case}` : '');
        const response = await axios.get(url);
        res.status(200).json(response.data);
        return;
    }
    catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ error: 'Failed to send SMS', details: error.message });
        return;
    }
});
export default router;
//# sourceMappingURL=textMessagingRoutes.js.map