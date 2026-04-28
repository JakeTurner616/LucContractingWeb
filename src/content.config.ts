import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    hero_heading: z.string(),
    hero_text: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
    service_area: z.string().optional(),
    cta_label: z.string().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    location: z.string().optional(),
    image: z.string().optional(),
    summary: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { pages, services, projects };
