import express from 'express';
import axios from 'axios';
const app = express();
const port = 3000;
const router = express.Router();
// Middleware to parse JSON bodies
//app.use(express.json());
// POST endpoint to send SMS
router.post('/send-sms', async (req, res) => {
    const { api_key, to, from, sms, use_case } = req.body;
    if (!api_key || !to || !from || !sms) {
        res.status(400).json({ error: 'api_key, to, from, and sms are required' });
        return;
    }
    try {
        const url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${api_key}&to=${to}&from=${from}&sms=${encodeURIComponent(sms)}` +
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
//# sourceMappingURL=textMessaging.js.map