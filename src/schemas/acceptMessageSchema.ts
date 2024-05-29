import { z } from 'zod';

export const singInSchema = z.object({
  acceptMessage: z.string()
});
