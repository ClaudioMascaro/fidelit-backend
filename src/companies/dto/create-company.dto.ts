import { z } from 'zod';

export const createCompanySchema = z
  .object({
    name: z.string(),
    description: z.string(),
    logo: z.string(),
    segment: z.string(),
    website: z.string(),
    cnpj: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    address: z.object({
      street: z.string(),
      number: z.string(),
      additional: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    }),
    lcard_rule: z.object({
      max_stamps: z.number(),
      stamps_prize: z.string(),
      score_goal: z.number(),
      stamps_expiration_time: z.number(),
      score_expiration_time: z.number(),
      score_goal_prize: z.string(),
      score_booster: z.number(),
    }),
    plan: z.enum(['FREE', 'PRO', 'PREMIUM', 'INFINITY']),
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
        addressComplement: z.string().optional(),
        phone: z.string(),
        mobilePhone: z.string(),
      })
      .partial({
        addressComplement: true,
      }),
    remoteip: z.string(),
  })
  .partial({
    description: true,
    logo: true,
    website: true,
    phone: true,
    address: true,
    lcard_rule: true,
    creditCard: true,
    creditCardHolderInfo: true,
  })
  .strict();

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
