import { z } from 'zod';

export const stellarAddressSchema = z
  .string()
  .regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar address');

export const amountSchema = z
  .string()
  .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Amount must be greater than 0');

export const validateStellarAddress = (address: string): boolean => {
  return /^G[A-Z0-9]{55}$/.test(address);
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
