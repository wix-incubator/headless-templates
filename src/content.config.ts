import { defineCollection, z } from "astro:content";
import { wixLoader } from "./wix";

const blog = defineCollection({
  loader: wixLoader(),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    richContent: z.any().optional(),
  }),
});

export const collections = { blog };
