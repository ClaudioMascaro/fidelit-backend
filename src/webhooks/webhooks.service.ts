import { Injectable, Logger } from '@nestjs/common';
import { handlePaymentWebhookDto } from './dto/handle-payment-webhook.dto';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class WebhooksService {
  constructor(private companiesService: CompaniesService) {}

  async handlePaymentWebhook(handlePaymentWebhookDto: handlePaymentWebhookDto) {
    const company = await this.companiesService.findByExternalCustomerId(
      handlePaymentWebhookDto.payment.customer,
    );

    if (!company) {
      Logger.fatal('Company not found');
    }

    if (handlePaymentWebhookDto.event === 'PAYMENT_OVERDUE') {
      await this.companiesService.update(company.id, {
        plan_status: 'inactive',
      });
    }

    if (handlePaymentWebhookDto.event === 'PAYMENT_CONFIRMED') {
      await this.companiesService.update(company.id, {
        plan_status: 'active',
      });
    }

    return;
  }
}
