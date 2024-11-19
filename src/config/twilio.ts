import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
  accountSid: `${process.env.TWILIO_ACCOUNT_SID}`,
  authToken: `${process.env.TWILIO_AUTH_TOKEN}`,
  from: `${process.env.TWILIO_WHATSAPP_FROM}`,
  enabled: `${process.env.TWILIO_ENABLED}` === 'true',
  verifyServiceSid: `${process.env.TWILIO_VERIFY_SERVICE_SID}`,
};

export default registerAs('twilio', () => config);
