import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z.string(),
    cpf: z.string(),
    phone: z.string(),
    password: z.string(),
  })
  .partial({
    cpf: true,
    phone: true,
    email: true,
  })
  .strict();

export type SignInDto = z.infer<typeof signInSchema>;
