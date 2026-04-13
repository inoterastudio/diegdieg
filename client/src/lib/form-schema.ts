import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus terdiri dari minimal 2 karakter",
  }),
  email: z.string().email({
    message: "Masukkan alamat email yang valid",
  }),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, {
    message: "Pesan harus terdiri dari minimal 10 karakter",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
