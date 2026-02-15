import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const profileSchema = z.object({
  name: z.string().min(2),
  department: z.string().min(2),
  strengths: z.array(z.string()).default([]),
  weakSubjects: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  availability: z.array(
    z.object({
      day: z.string(),
      startHour: z.number().min(0).max(23),
      endHour: z.number().min(1).max(24)
    })
  )
});

export const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).default([]),
  maxMembers: z.number().min(2).max(30)
});
