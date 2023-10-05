import { z } from "zod";

export const validateUser = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: "users's first name is required",
      })
      .max(20),
    lastName: z
      .string({
        required_error: "users's last name is required",
      })
      .max(20),
    email: z.string({
      required_error: "users's email is needed",
    }),
    mobileNumber: z.string({
      required_error: "your mobile number is required.",
    }),
    password: z.string({ required_error: "Your password is required" }).max(15),
    role: z.string().default("user"),
    isBlocked: z.boolean().default(false),
    cart: z.array(z.string()),
    address: z.array(z.string()),
    wishlists: z.array(z.string()),
    refreshToken: z.string().optional(),
    passwordChangedAt: z.date().nullable(),
    passwordResetToken: z.string().nullable(),
    passwordResetExpires: z.date().nullable(),
  }),
});
