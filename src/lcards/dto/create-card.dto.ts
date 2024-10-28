import { z } from 'zod';

export const createLcardSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    cpf: z.string().length(11),
    birthday: z.string().date(),
    phone: z.string(),
    company_id: z.number(),
    startingPoints: z.number(),
    startingStamps: z.number(),
  })
  .partial({
    startingPoints: true,
    startingStamps: true,
    company_id: true,
  })
  .strict();

export type CreateLcardDto = z.infer<typeof createLcardSchema>;
