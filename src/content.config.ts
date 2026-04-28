import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    meta: z.object({
      title: z.string(),
      description: z.string().optional(),
      canonical_path: z.string().optional(),
      social_title: z.string().optional(),
      social_description: z.string().optional(),
      social_image: z.string().optional(),
    }).optional(),
    hero_heading: z.string(),
    hero_text: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
    service_area: z.string().optional(),
    cta_label: z.string().optional(),
    intro_heading: z.string().optional(),
    services_eyebrow: z.string().optional(),
    services_heading: z.string().optional(),
    projects_eyebrow: z.string().optional(),
    projects_heading: z.string().optional(),
    contact: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
    }).optional(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/site" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    canonical_path: z.string().optional(),
    social_title: z.string().optional(),
    social_description: z.string().optional(),
    social_image: z.string().optional(),
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

export const collections = { pages, site, services, projects };
