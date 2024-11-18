import { z } from 'zod';

export const createSaleSchema = z
  .object({
    company_id: z.number(),
    user_id: z.number(),
    lcard_id: z.number(),
    value: z.number(),
  })
  .partial({
    company_id: true,
  })
  .strict();

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
