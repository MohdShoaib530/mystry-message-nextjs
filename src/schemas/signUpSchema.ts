import { z } from 'zod';

export const userNameValidation = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters long.' })
  .max(20, { message: 'Username must be at most 20 characters long.' })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: 'Username must only contain letters, numbers, and underscores.'
  });

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: 'Invalid email.' }),
  password: z
    .string()
    .min(8, { message: 'password must be at least 8 characters' })
    .max(20)
});
