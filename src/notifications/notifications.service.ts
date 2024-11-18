import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationsService {
  private client: Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');
    this.client = new Twilio(accountSid, authToken);
  }

  async sendWhatsAppMessage(to: string, body: string): Promise<void> {
    const from = this.configService.get<string>('twilio.from');

    const whatsappNotificationEnabled =
      this.configService.get<boolean>('twilio.enabled');

    if (!whatsappNotificationEnabled) {
      return;
    }
    await this.client.messages.create({
      from,
      to: `whatsapp:${to}`,
      body,
    });
  }
}
