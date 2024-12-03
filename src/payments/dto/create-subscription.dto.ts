import { z } from 'zod';

export const createSubscriptionSchema = z
  .object({
    customer: z.string(),
    description: z.string(),
    billingType: z.enum(['CREDIT_CARD']),
    value: z.number(),
    nextDueDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Invalid date format, should be yyyy-mm-dd',
      ),
    cycle: z.enum(['MONTHLY', 'YEARLY']),
    callback: z.object({
      successUrl: z.string(),
    }),
    creditCard: z.object({
      holderName: z.string(),
      number: z.string(),
      expiryMonth: z.string(),
      expiryYear: z.string(),
      ccv: z.string(),
    }),
    creditCardHolderInfo: z
      .object({
        name: z.string(),
        email: z.string(),
        cpfCnpj: z.string(),
        postalCode: z.string(),
        addressNumber: z.string(),
        addressComplement: z.string(),
        phone: z.string(),
        mobilePhone: z.string(),
      })
      .partial({
        addressComplement: true,
      }),
    remoteip: z.string(),
  })
  .strict();

export type CreateSubscriptionDto = z.infer<typeof createSubscriptionSchema>;
