import { z } from "zod";

export const LOCATION_CATEGORIES = ["Beaches", "Dining", "Stay", "Cultural"] as const;

const text = (max: number) => z.string().trim().max(max);

/** URL ảnh: https tuyệt đối, hoặc đường dẫn nội bộ ("/uploads/...", "/image/..."). Chặn javascript:, data:, //host. */
export const imageUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine(
    (v) => /^https:\/\/[^\s]+$/i.test(v) || (v.startsWith("/") && !v.startsWith("//")),
    { message: "Image URL must be https:// or a local path" },
  );

/**
 * Các field địa điểm mà client được phép gửi. Không có status/authorId — server tự gán.
 * Không dùng .default() ở đây: với schema update (.partial()), default sẽ ghi đè field
 * người dùng không gửi thành chuỗi rỗng.
 */
const locationFields = z.object({
  name: text(200).min(1),
  description: text(5000),
  category: z.enum(LOCATION_CATEGORIES),
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  imageUrl: imageUrlSchema,
  address: text(500),
  bestTiming: text(200),
  price: text(100),
  contact: text(200),
});

export const createLocationSchema = locationFields.partial({
  description: true,
  address: true,
  bestTiming: true,
  price: true,
  contact: true,
});

export const updateLocationSchema = locationFields
  .partial()
  .refine((v) => (v.lat === undefined) === (v.lng === undefined), {
    message: "lat and lng must be provided together",
    path: ["lat"],
  });

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
