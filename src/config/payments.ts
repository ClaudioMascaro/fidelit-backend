import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
  apiKey: `${process.env.PAYMENTS_SERVICE_API_KEY}`,
  apiUrl: `${process.env.PAYMENTS_SERVICE_URL}`,
};

export default registerAs('payments', () => config);
