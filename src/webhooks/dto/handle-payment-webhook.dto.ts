import { z } from 'zod';

export const handlePaymentWebhookSchema = z.object({
  event: z.enum(['PAYMENT_OVERDUE', 'PAYMENT_CONFIRMED']),
  payment: z.object({
    customer: z.string(),
    subscription: z.string(),
  }),
});

export type handlePaymentWebhookDto = z.infer<
  typeof handlePaymentWebhookSchema
>;
