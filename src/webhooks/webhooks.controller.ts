import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  Version,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/validation/pipeline.validation';
import { WebhooksService } from './webhooks.service';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  handlePaymentWebhookDto,
  handlePaymentWebhookSchema,
} from './dto/handle-payment-webhook.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  // add token
  @Version('1')
  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe(handlePaymentWebhookSchema))
  async handlePaymentWebhook(
    @Body()
    handlePaymentWebhookDto: handlePaymentWebhookDto,
  ): Promise<void> {
    return this.webhooksService.handlePaymentWebhook(handlePaymentWebhookDto);
  }
}
