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
import { PaymentsService } from './payments.service';
import {
  CreateCustomerDto,
  createCustomerSchema,
} from './dto/create-customer.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { createSubscriptionSchema } from './dto/create-subscription.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Version('1')
  @Post('customers')
  @Public()
  @UsePipes(new ZodValidationPipe(createCustomerSchema))
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<object> {
    return this.paymentsService.createCustomer(createCustomerDto);
  }

  @Version('1')
  @Post('subscriptions')
  @Public()
  @UsePipes(new ZodValidationPipe(createSubscriptionSchema))
  async createSubscription(
    @Body() createSubscriptionDto: object,
  ): Promise<object> {
    return this.paymentsService.createSubscription(createSubscriptionDto);
  }

  @Version('1')
  @Get('customers/:id')
  @Public()
  async getCustomer(@Param('id') id: string): Promise<object> {
    return this.paymentsService.getCustomer(id);
  }

  @Version('1')
  @Get(':id')
  @Public()
  async getSubscription(@Param('id') id: string): Promise<object> {
    return this.paymentsService.getSubscription(id);
  }
}
