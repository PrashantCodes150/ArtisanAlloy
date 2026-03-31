import { z } from 'zod';

const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'Variant SKU is required'),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).default(0),
  attributes: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
  }).optional(),
  isActive: z.boolean().default(true),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').max(200),
    description: z.string().min(1, 'Description is required').max(5000),
    shortDescription: z.string().max(500).optional(),
    price: z.number().min(0, 'Price cannot be negative'),
    originalPrice: z.number().min(0).optional(),
    images: z.array(productImageSchema).min(1, 'At least one image is required'),
    category: z.string().min(1, 'Category is required'),
    sku: z.string().min(1, 'SKU is required'),
    stock: z.number().int().min(0).default(0),
    lowStockThreshold: z.number().int().min(0).default(10),
    occasion: z.array(z.string()).optional(),
    personality: z.array(z.string()).optional(),
    material: z.array(z.string()).optional(),
    outfit: z.array(z.string()).optional(),
    viral: z.array(z.string()).optional(),
    gifting: z.array(z.string()).optional(),
    variants: z.array(productVariantSchema).optional(),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false),
    isNew: z.boolean().default(true),
    isBestseller: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
