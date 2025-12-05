import sanitizeHtml from "sanitize-html";

export const SAFE_TEXT_REGEX = /^[\p{L}\p{N}\p{P}\p{Zs}\p{Emoji}|_*^]*$/u;

export function sanitizeText(text: string): string {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

import { z } from "zod";

export function textField({ max }: { max: number }) {
  return z
    .string()
    .trim()
    .max(max, { message: `Must be under ${max} characters` })
    .transform((val) => sanitizeText(val))
    .refine((val) => SAFE_TEXT_REGEX.test(val), {
      message: "Text contains invalid characters",
    });
}
