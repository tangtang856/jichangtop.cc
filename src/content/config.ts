import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    h1: z.string().optional(),
    tag: z.string().default('选购指南'),
    readTime: z.string().default('约 5 分钟'),
    date: z.string().default('2026-03-30'),
    author: z.string().default('机场Top编辑部')
  })
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    h1: z.string().optional(),
    tag: z.string().default('使用教程'),
    readTime: z.string().default('约 5 分钟'),
    date: z.string().default('2026-03-30'),
    author: z.string().default('机场Top编辑部')
  })
});

export const collections = {
  blog,
  guides
};
