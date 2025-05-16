// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Router, Request, Response } from 'express';
// import axios, { AxiosRequestConfig } from 'axios';



// const router: Router = express.Router();

// // Load environment variables from .env file
// dotenv.config();
// console.log('about to test')

// const arkesel_api_key = process.env.ARKESEL_API_KEY;

// if (!arkesel_api_key) {
//     console.error('ARKESEL_API_KEY environment variable not set');
//     process.exit(1);
// }

// // Define an interface for the request body
// interface SmsRequestBody {
//     sender: string;
//     message: string;
//     recipients: string[];
//     scheduled_date?: string;
//     callback_url?: string;
// }


// // Endpoint to send SMS
// router.post('/send-sms', async (req: Request<object, object, SmsRequestBody>, res: Response): Promise<void> => {
//     const { sender, message, recipients, scheduled_date, callback_url } = req.body;

//     //console.log('in router.post(/send-sms), arkesel_api_key: ', arkesel_api_key);

//     console.log('Sending SMS:', sender, message, recipients, scheduled_date, callback_url);

//     // Validate required fields
//     if (!sender || !message || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
//          res.status(400).json({ success: false, message: 'Invalid input parameters' });
//         return
//     }

//     // Prepare data for SMS
//     const data: SmsRequestBody = { sender, message, recipients };

//     // Add optional fields
//     if (scheduled_date) {
//         data.scheduled_date = scheduled_date;
//     }
//     if (callback_url) {
//         data.callback_url = callback_url;
//     }

    

//     // Config for Axios request
//     const config: AxiosRequestConfig<unknown> = {
//         method: 'post',
//         url: 'https://sms.arkesel.com/api/v2/sms/send',
//         headers: {
//             'api-key': arkesel_api_key
//         },
//         data: data,
//     };

//     try {
//         const response = await axios(config);
//         res.status(200).json({ success: true, data: response.data });
//         return
//     } catch (error: unknown) {
//         console.error('Error sending SMS:', error);
//         res.status(500).json({ success: false, message: 'Error sending SMS', error });
//         return
//     }
// });


// export default router;










