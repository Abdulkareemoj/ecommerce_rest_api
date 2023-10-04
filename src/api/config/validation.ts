import { z } from "zod";

const validateAuthentication = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: "users's first name is required",
      })
      .min(12)
          .max(20),
      lastName: z.string({
          required_error: "users's last name is required",
      }).min(12).max(20),
      email: z.string({
          required_error: "users's email is needed",
        
      })
  }),
    
});