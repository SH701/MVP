import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
    password: z
      .string()
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      .regex(/[^A-Za-z0-9]/, { message: '특수문자를 하나 이상 포함해야 합니다.' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });