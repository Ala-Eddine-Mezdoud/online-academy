import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.').min(1, 'This field is required.'),
  password: z.string().min(1, 'This field is required.'),
  rememberMe: z.boolean().optional(),
});

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'This field is required.'),
  email: z.string().email('Please enter a valid email address.').min(1, 'This field is required.'),
  phone: z.string().regex(/^\d+$/, 'Phone number must contain only digits').min(6, 'Phone number must be at least 6 digits').optional().or(z.literal('')),
  wilaya: z.string().min(1, 'This field is required.'),
  password: z
    .string()
    .min(8, 'Password is too weak. Use at least 8 characters, one uppercase letter, a number and a special character.')
    .regex(/[A-Z]/, 'Password is too weak. Use at least 8 characters, one uppercase letter, a number and a special character.')
    .regex(/[0-9]/, 'Password is too weak. Use at least 8 characters, one uppercase letter, a number and a special character.')
    .regex(/[^A-Za-z0-9]/, 'Password is too weak. Use at least 8 characters, one uppercase letter, a number and a special character.'),
  confirmPassword: z.string().min(1, 'This field is required.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.').min(1, 'This field is required.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;


