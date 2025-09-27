import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "유효한 이메일 주소를 입력해주세요" })
    .max(255, { message: "이메일은 255자 이하여야 합니다" }),
  password: z.string()
    .min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다" })
    .max(72, { message: "비밀번호는 72자 이하여야 합니다" })
});

export const signupSchema = loginSchema;

// Settings validation
export const settingsSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "유효한 이메일 주소를 입력해주세요" })
    .max(255, { message: "이메일은 255자 이하여야 합니다" }),
  send_time: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "유효한 시간 형식(HH:MM)을 입력해주세요" })
});

// Keyword validation
export const keywordSchema = z.object({
  value: z.string()
    .trim()
    .min(1, { message: "키워드를 입력해주세요" })
    .max(100, { message: "키워드는 100자 이하여야 합니다" }),
  weight: z.number()
    .min(1, { message: "가중치는 1 이상이어야 합니다" })
    .max(10, { message: "가중치는 10 이하여야 합니다" })
    .default(1)
});

// Source validation
export const sourceSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "소스 이름을 입력해주세요" })
    .max(100, { message: "소스 이름은 100자 이하여야 합니다" }),
  url: z.string()
    .trim()
    .url({ message: "유효한 URL을 입력해주세요" })
    .max(500, { message: "URL은 500자 이하여야 합니다" }),
  type: z.enum(['blog', 'news', 'social'], { 
    message: "유효한 소스 타입을 선택해주세요" 
  })
});

// Person validation
export const personSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "이름을 입력해주세요" })
    .max(100, { message: "이름은 100자 이하여야 합니다" }),
  platform: z.string()
    .trim()
    .min(1, { message: "플랫폼을 입력해주세요" })
    .max(50, { message: "플랫폼은 50자 이하여야 합니다" })
});

// Trend validation
export const trendSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "제목을 입력해주세요" })
    .max(200, { message: "제목은 200자 이하여야 합니다" }),
  summary: z.string()
    .trim()
    .min(1, { message: "요약을 입력해주세요" })
    .max(1000, { message: "요약은 1000자 이하여야 합니다" }),
  source: z.string()
    .trim()
    .min(1, { message: "출처를 입력해주세요" })
    .max(100, { message: "출처는 100자 이하여야 합니다" }),
  source_type: z.string()
    .trim()
    .max(50, { message: "소스 타입은 50자 이하여야 합니다" }),
  url: z.string()
    .trim()
    .url({ message: "유효한 URL을 입력해주세요" })
    .max(500, { message: "URL은 500자 이하여야 합니다" })
    .optional(),
  author: z.string()
    .trim()
    .max(100, { message: "작성자는 100자 이하여야 합니다" })
    .optional(),
  keywords: z.array(z.string().trim().max(50))
    .max(20, { message: "키워드는 최대 20개까지 가능합니다" })
    .optional()
});