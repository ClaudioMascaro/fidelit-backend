import { z } from 'zod';

export const createCardSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    startingPoints: z.number(),
    startingStamps: z.number(),
    stampsCap: z.number(),
  })
  .partial({
    startingPoints: true,
    startingStamps: true,
  })
  .strict();

export type CreateCardDto = z.infer<typeof createCardSchema>;
