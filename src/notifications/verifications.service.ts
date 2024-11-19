import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class VerificationService {
  private client: Twilio;
  private verifyServiceSid: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');
    this.verifyServiceSid = this.configService.get<string>(
      'twilio.verifyServiceSid',
    );
    this.client = new Twilio(accountSid, authToken);
  }

  async sendVerification(to: string, channel: 'sms' | 'email'): Promise<void> {
    await this.client.verify
      .services(this.verifyServiceSid)
      .verifications.create({
        to,
        channel,
      });
  }

  async checkVerification(to: string, code: string): Promise<boolean> {
    const verificationCheck = await this.client.verify
      .services(this.verifyServiceSid)
      .verificationChecks.create({
        to,
        code,
      });

    return verificationCheck.status === 'approved';
  }
}
