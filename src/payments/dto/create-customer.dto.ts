import { z } from 'zod';

export const createCustomerSchema = z
  .object({
    name: z.string(),
    cpfCnpj: z.string(),
  })
  .strict();

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
