import { z } from 'zod';
import { createCompanySchema } from './create-company.dto';

export const UpdateCompanySchema = createCompanySchema.partial();

export type UpdateCompanyDto = z.infer<typeof UpdateCompanySchema>;
