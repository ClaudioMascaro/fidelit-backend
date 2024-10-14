import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    cpf: z.string(),
    cnpj: z.string(),
    password: z.string(),
    role: z.string(),
    company_id: z.number(),
    birthday: z.date(),
  })
  .partial({
    cpf: true,
    cnpj: true,
  })
  .strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;
